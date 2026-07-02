import { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Clustering() {
  const [smiles, setSmiles] = useState("");
  const [smilesList, setSmilesList] = useState([]);
  const [clusterResults, setClusterResults] = useState(null);
  const [umapResults, setUmapResults] = useState(null);
  const [tsneResults, setTsneResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nClusters, setNClusters] = useState(3);
  const [fpType, setFpType] = useState("morgan");
  const [visualizationType, setVisualizationType] = useState("umap");
  const [status, setStatus] = useState("");

  // Example molecules for quick testing
  const examples = [
    "Aspirin",
    "Caffeine",
    "Paracetamol",
    "Ibuprofen",
    "Naproxen",
    "Diclofenac",
    "Acetaminophen",
    "Indomethacin",
  ];

  const addSmiles = () => {
    if (!smiles.trim()) {
      setStatus("Please enter a compound name or SMILES.");
      return;
    }
    setSmilesList([...smilesList, smiles.trim()]);
    setSmiles("");
    setStatus("");
  };

  const addExample = (example) => {
    if (!smilesList.includes(example)) {
      setSmilesList([...smilesList, example]);
    }
  };

  const removeSmiles = (index) => {
    setSmilesList(smilesList.filter((_, i) => i !== index));
  };

  const runClustering = async () => {
    if (smilesList.length < 2) {
      setStatus("Add at least 2 compounds for clustering.");
      return;
    }

    if (nClusters >= smilesList.length) {
      setStatus(`Clusters must be less than number of compounds (${smilesList.length})`);
      return;
    }

    try {
      setLoading(true);
      setStatus("Computing fingerprints and clustering...");

      const response = await axios.post(`${API_BASE_URL}/cluster`, {
        smiles: smilesList,
        n_clusters: nClusters,
        fp_type: fpType,
      });

      if (response.data?.error) {
        setStatus(`Error: ${response.data.error}`);
        return;
      }

      setClusterResults(response.data);
      setStatus(`Clustering complete! Silhouette Score: ${response.data.silhouette_score?.toFixed(3)}`);
    } catch (error) {
      console.error("Clustering Error:", error);
      setStatus("Could not reach backend. Ensure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const runUMAP = async () => {
    if (smilesList.length < 2) {
      setStatus("Add at least 2 compounds for UMAP.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Computing UMAP...");

      const response = await axios.post(`${API_BASE_URL}/umap`, {
        smiles: smilesList,
        fp_type: fpType,
        n_neighbors: Math.min(15, smilesList.length - 1),
        min_dist: 0.1,
      });

      if (response.data?.error) {
        setStatus(`Error: ${response.data.error}`);
        return;
      }

      setUmapResults(response.data);
      setStatus("UMAP visualization ready!");
    } catch (error) {
      console.error("UMAP Error:", error);
      setStatus("Could not reach backend. Ensure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const runTSNE = async () => {
    if (smilesList.length < 3) {
      setStatus("Add at least 3 compounds for t-SNE.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Computing t-SNE...");

      const response = await axios.post(`${API_BASE_URL}/tsne`, {
        smiles: smilesList,
        fp_type: fpType,
        perplexity: Math.min(30, Math.floor((smilesList.length - 1) / 3)),
      });

      if (response.data?.error) {
        setStatus(`Error: ${response.data.error}`);
        return;
      }

      setTsneResults(response.data);
      setStatus("t-SNE visualization ready!");
    } catch (error) {
      console.error("t-SNE Error:", error);
      setStatus("Could not reach backend. Ensure it's running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const getClusterPlotData = () => {
    if (!clusterResults) return null;

    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
    ];

    return {
      data: clusterResults.smiles.map((smiles, idx) => ({
        x: [clusterResults.centroids[clusterResults.clusters[idx]][0]],
        y: [clusterResults.centroids[clusterResults.clusters[idx]][1]],
        mode: "markers+text",
        marker: {
          size: 12,
          color: colors[clusterResults.clusters[idx] % colors.length],
        },
        text: [smiles],
        textposition: "top center",
        name: `Cluster ${clusterResults.clusters[idx]}`,
        type: "scatter",
      })),
      layout: {
        title: `K-Means Clustering (${nClusters} clusters, Silhouette: ${clusterResults.silhouette_score?.toFixed(3)})`,
        xaxis: { title: "Dimension 1" },
        yaxis: { title: "Dimension 2" },
        hovermode: "closest",
        height: 500,
      },
    };
  };

  const getUMAPPlotData = () => {
    if (!umapResults) return null;

    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ];

    return {
      data: [
        {
          x: umapResults.x,
          y: umapResults.y,
          mode: "markers+text",
          marker: {
            size: 12,
            color: umapResults.smiles.map((_, idx) => colors[idx % colors.length]),
          },
          text: umapResults.smiles,
          textposition: "top center",
          type: "scatter",
        },
      ],
      layout: {
        title: "UMAP: Molecular Space Visualization",
        xaxis: { title: "UMAP 1" },
        yaxis: { title: "UMAP 2" },
        hovermode: "closest",
        height: 500,
      },
    };
  };

  const getTSNEPlotData = () => {
    if (!tsneResults) return null;

    const colors = [
      "#3b82f6",
      "#ef4444",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#f97316",
    ];

    return {
      data: [
        {
          x: tsneResults.x,
          y: tsneResults.y,
          mode: "markers+text",
          marker: {
            size: 12,
            color: tsneResults.smiles.map((_, idx) => colors[idx % colors.length]),
          },
          text: tsneResults.smiles,
          textposition: "top center",
          type: "scatter",
        },
      ],
      layout: {
        title: "t-SNE: Molecular Space Visualization",
        xaxis: { title: "t-SNE 1" },
        yaxis: { title: "t-SNE 2" },
        hovermode: "closest",
        height: 500,
      },
    };
  };

  return (
    <div className="container-fluid">
      <div className="hero-banner mb-4">
        <h1>Molecular Clustering & Visualization</h1>
        <p>Cluster molecules and explore high-dimensional data with UMAP and t-SNE.</p>
      </div>

      {/* Input Section */}
      <div className="workspace-card">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <h3>Add Molecules</h3>
            <p className="text-muted mb-0">Enter compound names or SMILES strings</p>
          </div>
          <span className={`status-pill ${status ? "ok" : "idle"}`}>{status || "Ready"}</span>
        </div>

        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter compound name or SMILES..."
            value={smiles}
            onChange={(e) => setSmiles(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSmiles()}
          />
          <button className="btn btn-primary" onClick={addSmiles}>
            Add
          </button>
        </div>

        <div className="mb-3">
          <p className="small text-muted mb-2">Quick add examples:</p>
          <div className="d-flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                className="btn btn-outline-secondary btn-sm"
                onClick={() => addExample(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {smilesList.length > 0 && (
          <div className="mb-3">
            <p className="small text-muted mb-2">Molecules ({smilesList.length}):</p>
            <div className="d-flex flex-wrap gap-2">
              {smilesList.map((s, idx) => (
                <span key={idx} className="badge bg-info text-dark">
                  {s}
                  <button
                    className="btn-close btn-close-white ms-1"
                    onClick={() => removeSmiles(idx)}
                    style={{ padding: "2px 4px", fontSize: "10px" }}
                  ></button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Options Section */}
      <div className="workspace-card mt-4">
        <h3 className="mb-3">Analysis Options</h3>
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Fingerprint Type</label>
            <select
              className="form-select"
              value={fpType}
              onChange={(e) => setFpType(e.target.value)}
            >
              <option value="morgan">Morgan FP</option>
              <option value="maccs">MACCS Keys</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Number of Clusters</label>
            <input
              type="number"
              className="form-control"
              value={nClusters}
              onChange={(e) => setNClusters(Math.max(2, parseInt(e.target.value) || 2))}
              min="2"
              max={Math.max(2, smilesList.length - 1)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end gap-2">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={runClustering}
              disabled={loading || smilesList.length < 2}
            >
              {loading ? "Computing..." : "Run K-Means"}
            </button>
            <button
              className="btn btn-success flex-grow-1"
              onClick={runUMAP}
              disabled={loading || smilesList.length < 2}
            >
              UMAP
            </button>
            <button
              className="btn btn-warning flex-grow-1"
              onClick={runTSNE}
              disabled={loading || smilesList.length < 3}
            >
              t-SNE
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {clusterResults && (
        <div className="workspace-card mt-4">
          <h3>Clustering Results</h3>
          <Plot
            data={getClusterPlotData()?.data || []}
            layout={getClusterPlotData()?.layout || {}}
            useResizeHandler
            style={{ width: "100%", height: "500px" }}
          />
          <div className="mt-3">
            <div className="row">
              {Array.from({ length: nClusters }).map((_, clusterId) => (
                <div key={clusterId} className="col-md-4 mb-3">
                  <div className="property-card">
                    <h5>Cluster {clusterId}</h5>
                    <p className="mb-0">
                      {clusterResults.smiles
                        .filter((_, idx) => clusterResults.clusters[idx] === clusterId)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {umapResults && (
        <div className="workspace-card mt-4">
          <h3>UMAP Visualization</h3>
          <Plot
            data={getUMAPPlotData()?.data || []}
            layout={getUMAPPlotData()?.layout || {}}
            useResizeHandler
            style={{ width: "100%", height: "500px" }}
          />
        </div>
      )}

      {tsneResults && (
        <div className="workspace-card mt-4">
          <h3>t-SNE Visualization</h3>
          <Plot
            data={getTSNEPlotData()?.data || []}
            layout={getTSNEPlotData()?.layout || {}}
            useResizeHandler
            style={{ width: "100%", height: "500px" }}
          />
        </div>
      )}
    </div>
  );
}

export default Clustering;
