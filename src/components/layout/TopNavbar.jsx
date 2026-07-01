import { FaBell, FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="top-navbar">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search molecules, datasets..." />
      </div>

      <div className="nav-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        <button className="icon-btn">
          <FaBell />
        </button>

        <div className="profile">
          <div className="avatar">B</div>
          <span>Bhavya</span>
        </div>
      </div>
    </div>
  );
}

export default TopNavbar;