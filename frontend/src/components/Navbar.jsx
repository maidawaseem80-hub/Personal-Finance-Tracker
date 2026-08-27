import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">📊</span>
        <span>Personal Finance Tracker</span>
      </div>

      <div className="navbar-actions">
        <div className="notification-wrapper">
          <button
            className="notification-button"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <div className="ugh">🔔</div>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
              </div>

              <div className="notification-item">
                <span>💰</span>
                <div>
                  <strong>Welcome!</strong>
                  <p>Start tracking your finances today.</p>
                </div>
              </div>

              <div className="notification-item">
                <span>📊</span>
                <div>
                  <strong>Keep an eye on your budget</strong>
                  <p>Review your spending regularly.</p>
                </div>
              </div>

              <div className="notification-empty">
                You're all caught up!
              </div>
            </div>
          )}
        </div>

        <Link to="/settings" className="profile-button" >
          Profile
        </Link>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;