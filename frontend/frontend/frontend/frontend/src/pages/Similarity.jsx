function Similarity() {
  return (
    <div className="page-content">
      <div className="glass-card">
        <div className="card-heading">
          <div>
            <p className="card-kicker">Molecular comparison</p>
            <h1>Similarity analysis</h1>
          </div>
          <span className="status-pill ok">Available concept</span>
        </div>

        <p className="roadmap-intro">
          Similarity workflows help identify compounds with related substructures, shared fingerprints, and comparable physicochemical profiles.
        </p>

        <div className="filter-list">
          <div className="filter-card pass">
            <div className="filter-card-top">
              <h6>Fingerprint similarity</h6>
              <span className="status-pill ok">Tanimoto</span>
            </div>
            <p>Compare Morgan and MACCS fingerprints to rank structure overlap.</p>
          </div>
          <div className="filter-card pass">
            <div className="filter-card-top">
              <h6>Property-based comparison</h6>
              <span className="status-pill neutral">Descriptors</span>
            </div>
            <p>Match molecules based on polarity, size, and shape-related features.</p>
          </div>
          <div className="filter-card pass">
            <div className="filter-card-top">
              <h6>Clustering & screening</h6>
              <span className="status-pill neutral">Upcoming</span>
            </div>
            <p>Group similar molecules for SAR exploration and analog generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Similarity;