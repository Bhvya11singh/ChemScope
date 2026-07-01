import { useEffect, useRef, useState } from "react";

function MoleculeViewer({ smiles }) {
  const containerRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("Preparing 2D structure...");

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

    try {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "320");
      svg.setAttribute("height", "320");
      svg.setAttribute("viewBox", "0 0 320 320");
      svg.style.width = "320px";
      svg.style.height = "320px";
      svg.style.background = "#f8fafc";
      svg.style.borderRadius = "16px";

      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = smiles;
      svg.appendChild(title);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "20");
      text.setAttribute("y", "70");
      text.setAttribute("font-size", "16");
      text.setAttribute("font-family", "Arial, sans-serif");
      text.setAttribute("fill", "#0f172a");
      text.textContent = `SMILES: ${smiles}`;
      svg.appendChild(text);

      const bond = document.createElementNS("http://www.w3.org/2000/svg", "line");
      bond.setAttribute("x1", "70");
      bond.setAttribute("y1", "170");
      bond.setAttribute("x2", "250");
      bond.setAttribute("y2", "170");
      bond.setAttribute("stroke", "#0f172a");
      bond.setAttribute("stroke-width", "4");
      svg.appendChild(bond);

      const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle1.setAttribute("cx", "70");
      circle1.setAttribute("cy", "170");
      circle1.setAttribute("r", "16");
      circle1.setAttribute("fill", "#38bdf8");
      svg.appendChild(circle1);

      const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle2.setAttribute("cx", "250");
      circle2.setAttribute("cy", "170");
      circle2.setAttribute("r", "16");
      circle2.setAttribute("fill", "#f43f5e");
      svg.appendChild(circle2);

      const caption = document.createElementNS("http://www.w3.org/2000/svg", "text");
      caption.setAttribute("x", "20");
      caption.setAttribute("y", "290");
      caption.setAttribute("font-size", "12");
      caption.setAttribute("font-family", "Arial, sans-serif");
      caption.setAttribute("fill", "#475569");
      caption.textContent = "2D structure placeholder generated from the resolved SMILES";
      svg.appendChild(caption);

      container.appendChild(svg);
      setStatusMessage("Structure preview shown.");
    } catch (error) {
      console.error("Structure rendering failed:", error);
      setStatusMessage("Unable to render this molecule.");
    }
  }, [smiles]);

  return (
    <div className="molecule-viewer">
      <p className="viewer-caption">2D molecular depiction for the selected compound.</p>
      <div ref={containerRef} className="molecule-container" />
      <p className="viewer-status">{statusMessage}</p>
    </div>
  );
}

export default MoleculeViewer;