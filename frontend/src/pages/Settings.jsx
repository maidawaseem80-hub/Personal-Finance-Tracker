import "./Settings.css";

function Settings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences.</p>
      </div>

      <div className="settings-sections">
        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Profile</h2>
            <p>Update your personal information.</p>
          </div>

          <div className="settings-form">
            <div className="settings-field">
              <label htmlFor="settings-name">Full Name</label>
              <input
                id="settings-name"
                type="text"
                placeholder="Enter your full name"
              />
            </div>

            <div className="settings-field">
              <label htmlFor="settings-email">Email</label>
              <input
                id="settings-email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <button type="button" className="settings-primary-button">
              Save Changes
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Preferences</h2>
            <p>Customize how your finance tracker works.</p>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <h3>Currency</h3>
                <p>Select the currency used throughout the application.</p>
              </div>

              <select defaultValue="PKR">
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div className="settings-option">
              <div>
                <h3>Email Notifications</h3>
                <p>Receive notifications about your finances.</p>
              </div>

              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <h2>Security</h2>
            <p>Manage your account security.</p>
          </div>

          <div className="security-row">
            <div>
              <h3>Password</h3>
              <p>Change your account password.</p>
            </div>

            <button type="button" className="settings-secondary-button">
              Change Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;