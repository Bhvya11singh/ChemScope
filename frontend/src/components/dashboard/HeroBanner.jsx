import { motion } from "framer-motion";
import { FaAtom, FaFlask, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-banner"
    >
      <div className="hero-copy">
        <div className="hero-pill">
          Next-generation cheminformatics intelligence
        </div>

        <h1>
          Discover molecular insight with scientific clarity.
        </h1>

        <p>
          ChemScope combines predictive analytics, interactive
          visualization, and intelligent dataset exploration in a
          seamless research workspace.
        </p>

        <div className="hero-actions">
  <Link to="/datasets" className="btn btn-primary">
    Explore Datasets
  </Link>

  <Link to="/workspace" className="btn btn-outline-light">
    Open Workspace
  </Link>
</div>
</div>

      <div className="hero-visual">
        <motion.div
          whileHover={{
            scale: 1.04,
            y: -5,
            transition: { duration: 0.25 },
          }}
          className="hero-card"
        >
          <div className="hero-card-icon">
            <FaAtom />
          </div>

          <h4>Real-time Molecular Analysis</h4>

          <p>
            Monitor descriptors, similarity metrics,
            fingerprints and PCA projections in one elegant
            workspace.
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -5,
            transition: { duration: 0.25 },
          }}
          className="hero-card secondary"
        >
          <div className="hero-card-icon">
            <FaFlask />
          </div>

          <h4>Experiment-ready Workflows</h4>

          <p>
            Move from upload to insight using interactive
            visualizations, clustering, and molecular
            analytics.
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.04,
            y: -5,
            transition: { duration: 0.25 },
          }}
          className="hero-card tertiary"
        >
          <div className="hero-card-icon">
            <FaRocket />
          </div>

          <h4>Accelerated Discovery</h4>

          <p>
            Bring clarity to virtual screening and
            cheminformatics research using explainable AI and
            interactive dashboards.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroBanner;