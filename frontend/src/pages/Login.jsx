import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import analyticsIllustration from "../assets/analytics-pana.svg";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      login(data.token, data.data);

      navigate("/");
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-wrapper">
        <div className="login-illustration">
          <div className="illustration-circle circle-1"></div>
          <div className="illustration-circle circle-2"></div>
          <div className="illustration-circle circle-3"></div>
          <img src={analyticsIllustration} alt="Analytics illustration" className="illustration-image" />
        </div>

        <div className="login-container">
          <div className="login-header">
            <h1>Personal Finance Tracker</h1>
            <h2>Welcome Back!</h2>
            <p>Log in to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </button>

            <Link className="forgot-password-link" to="/forgot-password">
              Forgot Password?
            </Link>

            <Link className="back-to-signup-link" to="/signup">
              Don't have an account? Create Account
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;