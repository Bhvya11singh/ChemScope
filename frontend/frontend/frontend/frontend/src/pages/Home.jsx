import { motion } from "framer-motion";
import { FaChartLine, FaDatabase, FaFlask, FaFileAlt } from "react-icons/fa";
import HeroBanner from "../components/dashboard/HeroBanner";
import StatsCard from "../components/dashboard/StatsCard";

function Home() {
  return (
    <>
      <HeroBanner />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="stats-grid"
      >
        <StatsCard title="Molecules Analyzed" value="124" subtitle="Across 8 active workflows" icon={<FaChartLine />} />
        <StatsCard title="Datasets Loaded" value="18" subtitle="Curated for screening studies" icon={<FaDatabase />} />
        <StatsCard title="Simulations" value="57" subtitle="High-fidelity analytic runs" icon={<FaFlask />} />
        <StatsCard title="Reports" value="32" subtitle="Auto-generated insights" icon={<FaFileAlt />} />
      </motion.div>
    </>
  );
}

export default Home;