import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span>📊</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span>💳</span>
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span>💰</span>
          <span>Budgets</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span>📈</span>
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-item ${isActive ? "active" : ""}`
          }
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;