import { motion } from "framer-motion";
import { FaAtom, FaFlask, FaRocket } from "react-icons/fa";

function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-banner"
    >
      <div className="hero-copy">
        <div className="hero-pill">Next-generation cheminformatics intelligence</div>
        <h1>Discover molecular insight with scientific clarity.</h1>
        <p>
          ChemScope combines predictive analytics, interactive visualization, and intelligent dataset exploration in a seamless research workspace.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/datasets">Explore datasets</a>
          <a className="btn btn-outline-light" href="/workspace">Open workspace</a>
        </div>
      </div>

      <div className="hero-visual">
        <motion.div whileHover={{ scale: 1.02 }} className="hero-card">
          <div className="hero-card-icon"><FaAtom /></div>
          <h4>Real-time molecular analysis</h4>
          <p>Monitor descriptors, similarity metrics, and PCA projections in one elegant view.</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="hero-card secondary">
          <div className="hero-card-icon"><FaFlask /></div>
          <h4>Experiment-ready workflows</h4>
          <p>Move from upload to insight without friction across dashboards and analysis pipelines.</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="hero-card tertiary">
          <div className="hero-card-icon"><FaRocket /></div>
          <h4>Accelerated discovery</h4>
          <p>Bring clarity to screening campaigns with visual, explainable analytics.</p>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroBanner;