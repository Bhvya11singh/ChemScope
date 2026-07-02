function Descriptors() {
  return (
    <div className="page-content">
      <div className="glass-card">
        <div className="card-heading">
          <div>
            <p className="card-kicker">Descriptor suite</p>
            <h1>Descriptor analysis</h1>
          </div>
          <span className="status-pill neutral">Core chemistry</span>
        </div>

        <p className="roadmap-intro">
          Molecular descriptors translate structure into interpretable chemical features such as size, polarity, flexibility, and drug-likeness.
        </p>

        <div className="property-grid">
          <div className="property-card">
            <h6>Molecular weight</h6>
            <h3>Size</h3>
            <p>Key for permeability and formulation.</p>
          </div>
          <div className="property-card">
            <h6>LogP</h6>
            <h3>Hydrophobicity</h3>
            <p>Reflects partitioning and membrane affinity.</p>
          </div>
          <div className="property-card">
            <h6>TPSA</h6>
            <h3>Polarity</h3>
            <p>Useful for absorption and transport.</p>
          </div>
          <div className="property-card">
            <h6>Rotatable bonds</h6>
            <h3>Flexibility</h3>
            <p>Related to conformational adaptability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Descriptors;