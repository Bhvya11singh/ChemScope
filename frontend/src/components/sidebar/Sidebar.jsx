import { NavLink } from "react-router-dom";

import {
  FaFlask,
  FaDatabase,
  FaChartBar,
  FaAtom,
  FaMicroscope,
  FaInfoCircle,
  FaBrain,
  FaCube,
  FaFilePdf,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      path: "/",
      icon: <FaChartBar />,
      label: "Dashboard",
    },

    {
      path: "/workspace",
      icon: <FaAtom />,
      label: "Workspace",
    },

    {
      path: "/descriptors",
      icon: <FaFlask />,
      label: "Descriptors",
    },

    {
      path: "/similarity",
      icon: <FaMicroscope />,
      label: "Similarity Search",
    },

    {
      path: "/datasets",
      icon: <FaDatabase />,
      label: "Datasets",
    },

    {
      path: "/ml-lab",
      icon: <FaBrain />,
      label: "ML Lab",
    },

    {
      path: "/viewer3d",
      icon: <FaCube />,
      label: "3D Viewer",
    },

    {
      path: "/reports",
      icon: <FaFilePdf />,
      label: "Reports",
    },

    {
      path: "/about",
      icon: <FaInfoCircle />,
      label: "About",
    },
  ];

  return (
    <aside className="sidebar">

      <div className="logo-section">
        <h2>⚗ ChemScope</h2>
        <p>Scientific Workstation</p>
      </div>

      <nav className="sidebar-nav">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "menu-item active-menu"
                : "menu-item"
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

      </nav>

      <div className="sidebar-footer">

        <div className="user-card">
          <div className="avatar">B</div>

          <div>
            <h6>Bhavya</h6>
            <small>Research Mode</small>
          </div>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;