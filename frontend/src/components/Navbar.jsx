import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">💰</span>
        <span>Personal Finance Tracker</span>
      </div>

      <div className="navbar-actions">
        <button className="notification-button" type="button">
          🔔
        </button>

        <button className="profile-button" type="button">
          Profile
        </button>

        <button className="logout-button" type="button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;