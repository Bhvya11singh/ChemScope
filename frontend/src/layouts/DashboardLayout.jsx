import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <TopNavbar />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;