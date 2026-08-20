import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <Link to="/" className="sidebar-item active">
          <span>📊</span>
          <span>Dashboard</span>
        </Link>

        <Link to="/transactions" className="sidebar-item">
          <span>💳</span>
          <span>Transactions</span>
        </Link>

        <Link to="/budgets" className="sidebar-item">
          <span>💰</span>
          <span>Budgets</span>
        </Link>

        <Link to="/reports" className="sidebar-item">
          <span>📈</span>
          <span>Reports</span>
        </Link>

        <Link to="/settings" className="sidebar-item">
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;