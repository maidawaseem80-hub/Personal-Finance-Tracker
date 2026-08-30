import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;