import { useState } from "react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login submitted:", {
      email,
      password,
    });
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Personal Finance Tracker</h1>

          <h2>Welcome Back</h2>

          <p>Sign in to your account</p>
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
              required
            />
          </div>

          <button className="login-button" type="submit">
            Sign In
          </button>

          <a className="forgot-password-link" href="/forgot-password">
            Forgot Password?
          </a>
        </form>
      </div>
    </main>
  );
}

export default Login;