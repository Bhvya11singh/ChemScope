import math
import re
from typing import Optional, Tuple, List
import base64
from io import BytesIO

import pandas as pd
import requests
import numpy as np
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler

from rdkit import Chem
from rdkit.Chem import Descriptors, AllChem, rdMolDescriptors, DataStructs, QED, Draw
from rdkit.Chem import FilterCatalog

app = FastAPI(
    title="ChemScope API",
    description="Backend API for molecular analysis",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "ChemScope Backend Running"}


@app.get("/health")
def health():
    return {"status": "ok"}


def _normalize_query(query: str) -> str:
    cleaned = (query or "").strip()
    if not cleaned:
        return ""

    prefixes = [
        "smiles:",
        "SMILES:",
        "smiles=",
        "SMILES=",
        "inchi=",
        "InChI=",
        "inchikey=",
        "InChIKey=",
        "cid:",
        "CID:",
        "cas:",
        "CAS:",
        "pubchem:",
        "PUBCHEM:",
    ]

    for prefix in prefixes:
        if cleaned.startswith(prefix):
            cleaned = cleaned[len(prefix):].strip()
            break

    return cleaned


def _looks_like_inchi(value: str) -> bool:
    return bool(value) and value.startswith("InChI=")


def _looks_like_inchikey(value: str) -> bool:
    return bool(re.fullmatch(r"[A-Z]{14}-[A-Z]{10}-[A-Z]", value))


def _looks_like_cas(value: str) -> bool:
    return bool(re.fullmatch(r"\d{2,7}-\d{2}-\d", value))


def _looks_like_cid(value: str) -> bool:
    return bool(re.fullmatch(r"\d+", value))


def _pubchem_lookup(query: str) -> Optional[Tuple[str, dict]]:
    cleaned = _normalize_query(query)
    if not cleaned:
        return None

    encoded_query = requests.utils.quote(cleaned)

    cid_url = None
    if _looks_like_cid(cleaned):
        cid_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{encoded_query}/cids/JSON"
    elif _looks_like_inchi(cleaned):
        cid_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/{encoded_query}/cids/JSON"
    elif _looks_like_inchikey(cleaned):
        cid_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchikey/{encoded_query}/cids/JSON"
    else:
        cid_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{encoded_query}/cids/JSON"

    try:
        cid_response = requests.get(cid_url, timeout=15)
        if cid_response.status_code != 200:
            return None

        cid_payload = cid_response.json()
        cids = cid_payload.get("IdentifierList", {}).get("CID") or cid_payload.get("PropertyTable", {}).get("Properties", [])
        if not cids:
            return None

        cid = cids[0] if isinstance(cids, list) else cids
        if isinstance(cid, dict):
            cid = cid.get("CID")
        if not cid:
            return None

        props_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/property/CanonicalSMILES,IsomericSMILES,MolecularFormula,MolecularWeight,IUPACName,XLogP/JSON"
        props_response = requests.get(props_url, timeout=15)
        if props_response.status_code != 200:
            return None

        props_payload = props_response.json()
        properties = props_payload.get("PropertyTable", {}).get("Properties") or []
        if not properties:
            return None

        prop = properties[0]
        smiles = (
            prop.get("CanonicalSMILES")
            or prop.get("IsomericSMILES")
            or prop.get("SMILES")
            or prop.get("ConnectivitySMILES")
        )
        if not smiles:
            return None

        metadata = {
            "cid": prop.get("CID") or cid,
            "formula": prop.get("MolecularFormula"),
            "iupac": prop.get("IUPACName"),
            "weight": prop.get("MolecularWeight"),
            "xlogp": prop.get("XLogP"),
            "canonical_smiles": prop.get("CanonicalSMILES"),
            "isomeric_smiles": prop.get("IsomericSMILES"),
            "image": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{prop.get('CID') or cid}/PNG",
            "sdf": f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{prop.get('CID') or cid}/SDF",
            "source": "PubChem",
        }
        return smiles, metadata
    except Exception:
        return None


def _resolve_smiles(query: str) -> Tuple[str, Optional[dict]]:
    cleaned = _normalize_query(query)

    if not cleaned:
        raise HTTPException(status_code=400, detail="Please provide a molecule.")

    if Chem.MolFromSmiles(cleaned):
        return cleaned, None

    if _looks_like_inchi(cleaned):
        mol = Chem.MolFromInchi(cleaned)
        if mol is not None:
            return Chem.MolToSmiles(mol), {"source": "InChI", "input": cleaned}

    if _looks_like_inchikey(cleaned) or _looks_like_cas(cleaned) or _looks_like_cid(cleaned):
        pubchem_result = _pubchem_lookup(cleaned)
        if pubchem_result is not None:
            return pubchem_result

    pubchem_result = _pubchem_lookup(cleaned)
    if pubchem_result is not None:
        return pubchem_result

    raise HTTPException(status_code=404, detail="Unable to resolve molecule. Try a SMILES string, common name, InChI, InChIKey, CAS number, or PubChem CID.")


def _morgan_fp(mol) -> object:
    fp = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)
    return fp


def _maccs_fp(mol) -> object:
    fp = rdMolDescriptors.GetMACCSKeysFingerprint(mol)
    return fp


def _tanimoto(a, b) -> float:
    return round(DataStructs.TanimotoSimilarity(a, b), 4)


def _lipinski(mol) -> dict:
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    hbd = Descriptors.NumHDonors(mol)
    hba = Descriptors.NumHAcceptors(mol)
    return {
        "molecular_weight": round(mw, 2),
        "logp": round(logp, 2),
        "hbd": hbd,
        "hba": hba,
        "passed": mw <= 500 and logp <= 5 and hbd <= 5 and hba <= 10,
    }


def _veber(mol) -> dict:
    tpsa = Descriptors.TPSA(mol)
    rotb = Descriptors.NumRotatableBonds(mol)
    return {
        "tpsa": round(tpsa, 2),
        "rotatable_bonds": rotb,
        "passed": tpsa <= 140 and rotb <= 10,
    }


def _ghose(mol) -> dict:
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    mr = Descriptors.MolMR(mol)
    return {
        "molecular_weight": round(mw, 2),
        "logp": round(logp, 2),
        "molar_refractivity": round(mr, 2),
        "passed": 160 <= mw <= 480 and -0.4 <= logp <= 5.6 and 40 <= mr <= 130,
    }


def _pains(mol) -> list[str]:
    try:
        params = FilterCatalog.FilterCatalogParams()
        catalog = FilterCatalog.FilterCatalog(params)
        matches = []
        for entry in catalog.GetMatches(mol):
            matches.append(entry.GetDescription())
        return matches[:8]
    except Exception:
        return []


def _qed(mol) -> float:
    try:
        return round(QED.qed(mol), 4)
    except Exception:
        return round(max(0.0, min(1.0, 0.4 + 0.001 * Descriptors.MolWt(mol) - 0.01 * Descriptors.MolLogP(mol))), 4)


def _sas(mol) -> float:
    try:
        if hasattr(rdMolDescriptors, "CalcSAScore"):
            return round(rdMolDescriptors.CalcSAScore(mol), 4)
    except Exception:
        pass

    heavy_atoms = mol.GetNumHeavyAtoms()
    ring_count = sum(1 for ring in mol.GetRingInfo().AtomRings() if len(ring) >= 3)
    return round(max(1.0, 1.0 + 0.02 * heavy_atoms + 0.03 * ring_count), 4)


def _generate_2d_structure(mol) -> str:
    """Generate 2D structure SVG from molecule"""
    try:
        # Generate 2D coordinates
        AllChem.Compute2DCoords(mol)
        
        # Draw molecule to image
        img = Draw.MolToImage(mol, size=(400, 400))
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    except Exception as e:
        print(f"Error generating 2D structure: {e}")
        return None


@app.get("/analyze/{smiles}")
def analyze(smiles: str):
    try:
        resolved_smiles, metadata = _resolve_smiles(smiles)
        mol = Chem.MolFromSmiles(resolved_smiles)

        if mol is None:
            raise HTTPException(status_code=400, detail="Invalid molecular representation")

        morgan = _morgan_fp(mol)
        maccs = _maccs_fp(mol)
        structure_image = _generate_2d_structure(mol)

        return {
            "metadata": metadata,
            "smiles": resolved_smiles,
            "structure_image": structure_image,
            "molecular_weight": round(Descriptors.MolWt(mol), 2),
            "logP": round(Descriptors.MolLogP(mol), 2),
            "TPSA": round(Descriptors.TPSA(mol), 2),
            "h_donors": Descriptors.NumHDonors(mol),
            "h_acceptors": Descriptors.NumHAcceptors(mol),
            "rotatable_bonds": Descriptors.NumRotatableBonds(mol),
            "lipinski": _lipinski(mol),
            "veber": _veber(mol),
            "ghose": _ghose(mol),
            "pains_alerts": _pains(mol),
            "qed_score": _qed(mol),
            "synthetic_accessibility": _sas(mol),
            "fingerprints": {
                "morgan": {"bits": 2048, "value": str(morgan)},
                "maccs": {"bits": 167, "value": str(maccs)},
            },
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/pca")
def run_pca(dataset: list = Body(...)):
    try:
        if not dataset:
            return {"error": "Please upload a dataset with at least one row."}

        df = pd.DataFrame(dataset)

        for col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        numeric_df = df.dropna(axis=1, how="all")

        if numeric_df.shape[1] < 2:
            return {"error": "Need at least two numeric columns."}

        numeric_df = numeric_df.fillna(numeric_df.mean())
        pca = PCA(n_components=2)
        components = pca.fit_transform(numeric_df)

        return {
            "explained_variance": pca.explained_variance_ratio_.tolist(),
            "points": [{"pc1": float(point[0]), "pc2": float(point[1])} for point in components],
        }

    except Exception as e:
        return {"error": str(e)}


def _get_fingerprints_matrix(smiles_list: List[str], fp_type: str = "morgan") -> np.ndarray:
    """Generate fingerprint matrix from SMILES list"""
    fingerprints = []
    valid_smiles = []
    
    for smiles in smiles_list:
        resolved_smiles, _ = _resolve_smiles(smiles)
        mol = Chem.MolFromSmiles(resolved_smiles)
        
        if mol is not None:
            if fp_type == "morgan":
                fp = _morgan_fp(mol)
            else:
                fp = _maccs_fp(mol)
            
            # Convert fingerprint to numpy array
            fp_array = np.array(list(fp), dtype=np.float32)
            fingerprints.append(fp_array)
            valid_smiles.append(resolved_smiles)
    
    if not fingerprints:
        raise ValueError("No valid molecules found")
    
    return np.array(fingerprints), valid_smiles


@app.post("/cluster")
def cluster_molecules(request_data: dict = Body(...)):
    """K-Means clustering of molecules"""
    try:
        smiles_list = request_data.get("smiles", [])
        n_clusters = request_data.get("n_clusters", 3)
        fp_type = request_data.get("fp_type", "morgan")
        
        if not smiles_list:
            return {"error": "No SMILES provided"}
        
        if len(smiles_list) < n_clusters:
            return {"error": f"Cannot create {n_clusters} clusters with only {len(smiles_list)} molecules"}
        
        # Get fingerprints
        fp_matrix, valid_smiles = _get_fingerprints_matrix(smiles_list, fp_type)
        
        # Standardize
        scaler = StandardScaler()
        fp_scaled = scaler.fit_transform(fp_matrix)
        
        # K-Means clustering
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        clusters = kmeans.fit_predict(fp_scaled)
        
        # Calculate silhouette score
        from sklearn.metrics import silhouette_score
        silhouette = silhouette_score(fp_scaled, clusters)
        
        return {
            "clusters": clusters.tolist(),
            "smiles": valid_smiles,
            "n_clusters": n_clusters,
            "silhouette_score": float(silhouette),
            "centroids": kmeans.cluster_centers_.tolist()
        }
    
    except Exception as e:
        return {"error": str(e)}


@app.post("/umap")
def umap_reduction(request_data: dict = Body(...)):
    """UMAP dimensionality reduction for visualization"""
    try:
        smiles_list = request_data.get("smiles", [])
        fp_type = request_data.get("fp_type", "morgan")
        n_neighbors = request_data.get("n_neighbors", 15)
        min_dist = request_data.get("min_dist", 0.1)
        
        if not smiles_list:
            return {"error": "No SMILES provided"}
        
        # Try to import UMAP
        try:
            import umap
        except ImportError:
            return {"error": "UMAP not installed. Use 'pip install umap-learn'"}
        
        # Get fingerprints
        fp_matrix, valid_smiles = _get_fingerprints_matrix(smiles_list, fp_type)
        
        # Standardize
        scaler = StandardScaler()
        fp_scaled = scaler.fit_transform(fp_matrix)
        
        # UMAP reduction
        reducer = umap.UMAP(
            n_components=2,
            n_neighbors=min(n_neighbors, len(valid_smiles) - 1),
            min_dist=min_dist,
            random_state=42
        )
        embedding = reducer.fit_transform(fp_scaled)
        
        return {
            "embedding": embedding.tolist(),
            "smiles": valid_smiles,
            "x": embedding[:, 0].tolist(),
            "y": embedding[:, 1].tolist()
        }
    
    except Exception as e:
        return {"error": str(e)}


@app.post("/tsne")
def tsne_reduction(request_data: dict = Body(...)):
    """t-SNE dimensionality reduction for visualization"""
    try:
        smiles_list = request_data.get("smiles", [])
        fp_type = request_data.get("fp_type", "morgan")
        perplexity = request_data.get("perplexity", 30)
        
        if not smiles_list:
            return {"error": "No SMILES provided"}
        
        if len(smiles_list) < 3:
            return {"error": "t-SNE requires at least 3 molecules"}
        
        from sklearn.manifold import TSNE
        
        # Get fingerprints
        fp_matrix, valid_smiles = _get_fingerprints_matrix(smiles_list, fp_type)
        
        # Standardize
        scaler = StandardScaler()
        fp_scaled = scaler.fit_transform(fp_matrix)
        
        # t-SNE reduction
        perp = min(perplexity, (len(valid_smiles) - 1) / 3)
        tsne = TSNE(n_components=2, perplexity=perp, random_state=42, n_iter=1000)
        embedding = tsne.fit_transform(fp_scaled)
        
        return {
            "embedding": embedding.tolist(),
            "smiles": valid_smiles,
            "x": embedding[:, 0].tolist(),
            "y": embedding[:, 1].tolist()
        }
    
    except Exception as e:
        return {"error": str(e)}