import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const API_URL = import.meta.env.VITE_API_URL;

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-header">
            <h1>Password Reset Successful!</h1>
            <p>Redirecting you to login...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
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

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="reset-password-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
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