import { useState } from "react";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    console.log("Password reset submitted");
  };

  return (
    <main className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reset-password-form"
        >
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>

            <input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-new-password">
              Confirm New Password
            </label>

            <input
              id="confirm-new-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </div>

          <button type="submit" className="reset-password-button">
            Reset Password
          </button>

          <a className="back-to-login-link" href="/login">
            Back to Login
          </a>
        </form>
      </div>
    </main>
  );
}

export default ResetPassword;