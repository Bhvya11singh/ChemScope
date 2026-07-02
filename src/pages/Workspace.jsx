import { useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import MoleculeViewer from "../components/workspace/MoleculeViewer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Workspace() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");

  const examples = ["Aspirin", "Caffeine", "Paracetamol", "Ibuprofen", "CCO", "c1ccccc1"];
  const assistantExamples = [
    "Why is Aspirin more polar than Ibuprofen?",
    "Suggest molecules similar to Caffeine.",
    "Compare the solubility of Paracetamol and Aspirin.",
  ];

  const analyzeMolecule = async (inputQuery = query) => {
    if (!inputQuery.trim()) {
      setError("Please enter a compound name or SMILES.");
      return;
    }

    
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/analyze/${encodeURIComponent(inputQuery)}`);
      const data = response.data;

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setHistory((prev) => {
          const updated = [data, ...prev.filter((item) => item.smiles !== data.smiles)];
          return updated.slice(0, 6);
        });
      }
    } catch (err) {
      console.error(err);
      setError("Could not analyze molecule.");
    } finally {
      setLoading(false);
    }
  };

  const descriptorCards = result
    ? [
        { title: "Mol. Weight", value: result.molecular_weight },
        { title: "LogP", value: result.logP },
        { title: "TPSA", value: result.TPSA },
        { title: "H Donors", value: result.h_donors },
        { title: "H Acceptors", value: result.h_acceptors },
        { title: "Rotatable Bonds", value: result.rotatable_bonds },
      ]
    : [];

  const filterSummary = result
    ? [
        {
          title: "Lipinski",
          passed: result.lipinski?.passed,
          detail: `MW ${result.lipinski?.molecular_weight ?? "-"} • LogP ${result.lipinski?.logp ?? "-"} • HBD/HBA ${result.lipinski?.hbd ?? "-"}/${result.lipinski?.hba ?? "-"}`,
        },
        {
          title: "Veber",
          passed: result.veber?.passed,
          detail: `TPSA ${result.veber?.tpsa ?? "-"} • Rotatable bonds ${result.veber?.rotatable_bonds ?? "-"}`,
        },
        {
          title: "Ghose",
          passed: result.ghose?.passed,
          detail: `MR ${result.ghose?.molar_refractivity ?? "-"} • MW ${result.ghose?.molecular_weight ?? "-"}`,
        },
        {
          title: "QED",
          passed: (result.qed_score ?? 0) >= 0.5,
          detail: `Score ${result.qed_score ?? "-"}`,
        },
      ]
    : [];

  const fingerprintSummary = result
    ? [
        {
          title: "Morgan",
          bits: result.fingerprints?.morgan?.bits ?? 2048,
          value: result.fingerprints?.morgan?.value ?? "Generated",
        },
        {
          title: "MACCS",
          bits: result.fingerprints?.maccs?.bits ?? 167,
          value: result.fingerprints?.maccs?.value ?? "Generated",
        },
      ]
    : [];

  const descriptorChartData = result
    ? {
        x: descriptorCards.map((card) => card.title),
        y: descriptorCards.map((card) => card.value),
        type: "bar",
        marker: {
          color: ["#38bdf8", "#818cf8", "#34d399", "#f59e0b", "#fb7185", "#a78bfa"],
        },
        hovertemplate: "%{x}: %{y}<extra></extra>",
      }
    : null;

  const handleAssistantSubmit = () => {
    const prompt = assistantPrompt.trim();
    if (!prompt) {
      setAssistantResponse("Ask the assistant about a molecule, comparison, or property and it will summarize the chemistry reasoning.");
      return;
    }

    const lowerPrompt = prompt.toLowerCase();
    let reply = "";

    if (lowerPrompt.includes("polar") && lowerPrompt.includes("aspirin") && lowerPrompt.includes("ibuprofen")) {
      reply =
        "Aspirin is generally more polar than Ibuprofen because it contains a carboxylic acid and an ester group, which increase hydrogen-bonding and ionization potential. Ibuprofen has a single carboxylic acid and a larger hydrophobic aryl group, making it less polar overall.";
    } else if (lowerPrompt.includes("similar") && lowerPrompt.includes("caffeine")) {
      reply =
        "Similar scaffolds to Caffeine often include xanthine-like heterocycles with methylated amines and carbonyl groups. Candidates such as Theobromine, Theophylline, and related purine derivatives are strong starting points for similarity screening.";
    } else if (lowerPrompt.includes("solubility") && lowerPrompt.includes("paracetamol") && lowerPrompt.includes("aspirin")) {
      reply =
        "Paracetamol is typically more soluble than Aspirin in water at room temperature, while Aspirin is more acidic and can be more strongly influenced by pH. The difference is driven by ionization state and hydrogen-bonding patterns.";
    } else {
      reply = `The assistant can explain descriptor trends, compare molecules, and propose related compounds. Example: “${assistantExamples[0]}” or “${assistantExamples[1]}”.`;
    }

    setAssistantResponse(reply);
  };

  const workflowSteps = [
    { title: "1. Query", detail: "Search compounds or upload structures" },
    { title: "2. Evaluate", detail: "Inspect descriptors and rules" },
    { title: "3. Interpret", detail: "Visualize and reason with AI" },
  ];

  const toolModules = [
    { title: "Molecule Query", text: "Name, SMILES, and structure lookup" },
    { title: "Property Explorer", text: "Drug-likeness, fingerprints, and filters" },
    { title: "3D Viewer", text: "Interactive molecular rendering" },
    { title: "AI Assistant", text: "Natural-language chemistry reasoning" },
  ];

  const roadmapPhases = [
    {
      title: "Phase 3 — Advanced molecular visualization",
      subtitle: "Immersive structural exploration",
      items: [
        "Interactive 3D molecules",
        "Rotate/zoom",
        "Protein viewer (PDB)",
        "Surface rendering",
        "Electrostatic maps",
        "Atom highlighting",
        "Bond highlighting",
      ],
    },
    {
      title: "Phase 4 — Machine learning",
      subtitle: "Predictive chemistry workflows",
      items: [
        "Random Forest QSAR",
        "XGBoost property prediction",
        "Toxicity prediction",
        "Solubility prediction",
        "Activity prediction",
        "Molecular clustering",
        "UMAP",
        "t-SNE",
        "K-Means",
        "DBSCAN",
      ],
    },
    {
      title: "Phase 5 — Research analytics",
      subtitle: "From fingerprints to reports",
      items: [
        "PCA (already done)",
        "Correlation heatmaps",
        "Feature importance",
        "SHAP explanations",
        "Outlier detection",
        "Missing value analysis",
        "Automatic reports",
      ],
    },
  ];

  return (
    <div className="workspace-container">
      <div className="workspace-header">
        <div>
          <p className="card-kicker">Scientific workspace</p>
          <h1>Lightweight molecular discovery studio</h1>
          <p>Explore small molecules with a structured workflow similar to professional cheminformatics tools.</p>
        </div>
        <div className="workspace-status-badge">
          <span className="status-pill ok">Live analysis</span>
          <span className="status-pill neutral">Research-ready</span>
        </div>
      </div>

      <div className="workflow-strip">
        {workflowSteps.map((step) => (
          <div key={step.title} className="workflow-step">
            <h4>{step.title}</h4>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="workspace-toolbar glass-card">
        <div className="toolbar-module-list">
          {toolModules.map((module) => (
            <div key={module.title} className="toolbar-module">
              <h5>{module.title}</h5>
              <p>{module.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="workspace-search">
        <input
          type="text"
          placeholder="Enter a compound name (e.g. Aspirin) or SMILES"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyzeMolecule()}
        />
        <button onClick={() => analyzeMolecule()}>{loading ? "Analyzing..." : "Analyze"}</button>
      </div>

      <div className="example-section">
        <h5>Quick Examples</h5>
        <div className="example-chips">
          {examples.map((item) => (
            <button
              key={item}
              className="chip"
              onClick={() => {
                setQuery(item);
                analyzeMolecule(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="assistant-section glass-card mt-4">
        <div className="card-heading">
          <div>
            <p className="card-kicker">Phase 6 — AI assistant</p>
            <h3>Ask chemistry questions in plain language</h3>
          </div>
          <span className="status-pill neutral">Live concept</span>
        </div>
        <p className="roadmap-intro">
          The assistant can explain polarity, compare compounds, and suggest related molecules using descriptor reasoning and visual context.
        </p>

        <div className="assistant-input-row">
          <input
            type="text"
            value={assistantPrompt}
            onChange={(e) => setAssistantPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAssistantSubmit()}
            placeholder="Ask a chemistry question..."
          />
          <button onClick={handleAssistantSubmit}>Ask</button>
        </div>

        <div className="example-section">
          <h5>Example prompts</h5>
          <div className="example-chips">
            {assistantExamples.map((item) => (
              <button key={item} className="chip" onClick={() => setAssistantPrompt(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="assistant-response">
          <h5>Assistant response</h5>
          <p>{assistantResponse || "Try one of the example prompts to see the assistant in action."}</p>
        </div>
      </div>

      <div className="roadmap-section glass-card mt-4">
        <div className="card-heading">
          <div>
            <p className="card-kicker">Platform roadmap</p>
            <h3>Upcoming capabilities</h3>
          </div>
          <span className="status-pill neutral">Planned</span>
        </div>
        <p className="roadmap-intro">
          The analysis workflow is already live, and these next phases expand it into richer visualization, ML-driven modeling, and research grade analytics.
        </p>
        <div className="roadmap-grid">
          {roadmapPhases.map((phase) => (
            <div key={phase.title} className="roadmap-card">
              <h4>{phase.title}</h4>
              <p className="roadmap-subtitle">{phase.subtitle}</p>
              <ul className="roadmap-list">
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {result && (
        <div className="workspace-grid">
          <div className="glass-card">
            <div className="card-heading">
              <div>
                <p className="card-kicker">Structure & source</p>
                <h3>2D Structure</h3>
              </div>
              <span className="status-pill ok">{result.source || "SMILES input"}</span>
            </div>
            <MoleculeViewer smiles={result.smiles} structureImage={result.structure_image} />
            <div className="info-list">
              <div>
                <span>Resolved SMILES</span>
                <strong>{result.smiles}</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>{result.source || "SMILES input"}</strong>
              </div>
              <div>
                <span>PAINS alerts</span>
                <strong>{result.pains_alerts?.length ? result.pains_alerts.join(", ") : "None"}</strong>
              </div>
              <div>
                <span>Synthetic accessibility</span>
                <strong>{result.synthetic_accessibility}</strong>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-heading">
              <div>
                <p className="card-kicker">Chemistry readout</p>
                <h3>Molecular Properties</h3>
              </div>
              <span className="status-pill neutral">Live analysis</span>
            </div>
            <div className="property-grid">
              {descriptorCards.map((card) => (
                <div key={card.title} className="property-card">
                  <h6>{card.title}</h6>
                  <h3>{card.value}</h3>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h5>Rule-based filters</h5>
              <div className="filter-list">
                {filterSummary.map((filter) => (
                  <div key={filter.title} className={`filter-card ${filter.passed ? "pass" : "flag"}`}>
                    <div className="filter-card-top">
                      <h6>{filter.title}</h6>
                      <span className={`status-pill ${filter.passed ? "ok" : "flagged"}`}>
                        {filter.passed ? "Pass" : "Flag"}
                      </span>
                    </div>
                    <p>{filter.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h5>Descriptor profile</h5>
              {descriptorChartData && (
                <div className="chart-card">
                  <Plot
                    data={[descriptorChartData]}
                    layout={{
                      autosize: true,
                      paper_bgcolor: "rgba(0,0,0,0)",
                      plot_bgcolor: "rgba(0,0,0,0)",
                      margin: { l: 30, r: 10, t: 10, b: 40 },
                      font: { color: "#e2e8f0" },
                      xaxis: { showgrid: false },
                      yaxis: { showgrid: true, gridcolor: "rgba(255,255,255,0.08)" },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                    style={{ width: "100%", height: "280px" }}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h5>Fingerprints</h5>
              <div className="property-grid">
                {fingerprintSummary.map((fingerprint) => (
                  <div key={fingerprint.title} className="property-card">
                    <h6>{fingerprint.title}</h6>
                    <h3>{fingerprint.bits} bits</h3>
                    <p>{fingerprint.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass-card mt-4">
          <h3>Recent Analyses</h3>
          <div className="history-chips">
            {history.map((item) => (
              <button
                key={item.smiles}
                className="chip"
                onClick={() => {
                  setQuery(item.smiles);
                  setResult(item);
                }}
              >
                {item.source || item.smiles}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Workspace;