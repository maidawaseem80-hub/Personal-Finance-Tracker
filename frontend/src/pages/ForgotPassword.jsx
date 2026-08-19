import "./ForgotPassword.css";
function ForgotPassword() {
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Password reset requested");
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>

            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Send Reset Link
          </button>

          <a className="back-to-login-link" href="/login">
                Back to Login
          </a>
        </form>
      </div>
    </main>
  );
}

export default ForgotPassword;