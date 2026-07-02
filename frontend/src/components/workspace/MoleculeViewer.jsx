import { useEffect, useRef, useState } from "react";

function MoleculeViewer({ smiles, structureImage }) {
  const containerRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("Loading structure...");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    container.style.width = "100%";
    container.style.height = "360px";
    container.style.minHeight = "360px";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    if (!smiles?.trim()) {
      setStatusMessage("No molecule loaded.");
      return;
    }

    if (!structureImage) {
      setStatusMessage("No structure image available.");
      return;
    }

    try {
      const img = document.createElement("img");
      img.src = structureImage;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";
      img.alt = `2D structure of ${smiles}`;
      img.title = smiles;
      
      img.onload = () => {
        container.appendChild(img);
        setStatusMessage("2D structure rendered successfully.");
      };
      
      img.onerror = () => {
        setStatusMessage("Failed to load structure image.");
      };

    } catch (error) {
      console.error("Structure rendering failed:", error);
      setStatusMessage("Unable to render this molecule.");
    }
  }, [smiles, structureImage]);

  return (
    <div className="molecule-viewer">
      <p className="viewer-caption">2D molecular depiction for the selected compound.</p>
      <div ref={containerRef} className="molecule-container" />
      <p className="viewer-status">{statusMessage}</p>
    </div>
  );
}

export default MoleculeViewer;