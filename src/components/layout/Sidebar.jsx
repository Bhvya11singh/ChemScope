import { NavLink } from "react-router-dom";
import {
  FaChartLine,
  FaAtom,
  FaFlask,
  FaDatabase,
  FaProjectDiagram,
  FaInfoCircle
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { path: "/", icon: <FaChartLine />, label: "Dashboard" },
    { path: "/workspace", icon: <FaAtom />, label: "Workspace" },
    { path: "/descriptors", icon: <FaFlask />, label: "Descriptors" },
    { path: "/similarity", icon: <FaProjectDiagram />, label: "Similarity" },
    { path: "/datasets", icon: <FaDatabase />, label: "Datasets" },
    { path: "/about", icon: <FaInfoCircle />, label: "About" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <h2>⚗ ChemScope</h2>
        <p>Scientific Workstation</p>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;