function About() {
  return (
    <div className="page-content">
      <div className="glass-card">
        <div className="card-heading">
          <div>
            <p className="card-kicker">Platform overview</p>
            <h1>About ChemScope</h1>
          </div>
          <span className="status-pill neutral">Research platform</span>
        </div>

        <p className="roadmap-intro">
          ChemScope is a lightweight cheminformatics workspace designed for molecular exploration, descriptor analysis, similarity screening, and AI-assisted interpretation.
        </p>

        <div className="property-grid">
          <div className="property-card">
            <h6>Core focus</h6>
            <h3>Drug discovery</h3>
            <p>Structure-based reasoning and property analysis.</p>
          </div>
          <div className="property-card">
            <h6>Workflow</h6>
            <h3>Query → Analyze</h3>
            <p>From molecule lookup to descriptor-driven insights.</p>
          </div>
          <div className="property-card">
            <h6>Experience</h6>
            <h3>Interactive</h3>
            <p>3D viewer, analytics, and assistant-driven summaries.</p>
          </div>
          <div className="property-card">
            <h6>Future</h6>
            <h3>ML-ready</h3>
            <p>Built to expand into predictive and comparative modeling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;