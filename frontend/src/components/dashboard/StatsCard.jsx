import { motion } from "framer-motion";

function StatsCard({ title, value, subtitle, icon }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="stats-card"
    >
      <div className="stats-card-top">
        <div className="stats-icon">{icon}</div>
        <h6>{title}</h6>
      </div>
      <h2>{value}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
}

export default StatsCard;