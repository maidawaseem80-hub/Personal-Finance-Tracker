// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./SignUp.css";

// function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/auth/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name,
//             email,
//             password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Registration failed.");
//       }

//       navigate("/login");
//     } catch (error) {
//       setError(
//         error.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="signup-page">
//       <div className="signup-container">
//         <div className="signup-header">
//           <h1>Create Account</h1>
//           <p>Create your Personal Finance Tracker account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="signup-form">
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>

//             <input
//               id="name"
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(event) => setName(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="signup-email">Email</label>

//             <input
//               id="signup-email"
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="signup-password">Password</label>

//             <input
//               id="signup-password"
//               type="password"
//               placeholder="Create a password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirm-password">Confirm Password</label>

//             <input
//               id="confirm-password"
//               type="password"
//               placeholder="Confirm your password"
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//               required
//             />
//           </div>

//           {error && <p className="error-message">{error}</p>}

//           <button
//             type="submit"
//             className="signup-button"
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>

//           <Link className="back-to-login-link" to="/login">
//             Already have an account? Login
//           </Link>
//         </form>
//       </div>
//     </main>
//   );
// }

// export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import analyticsIllustration from "../assets/Analytics-pana.svg";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      navigate("/login");
    } catch (error) {
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-wrapper">
        <div className="signup-illustration">
          <div className="illustration-circle circle-1"></div>
          <div className="illustration-circle circle-2"></div>
          <div className="illustration-circle circle-3"></div>
          <img src={analyticsIllustration} alt="Analytics illustration" className="illustration-image" />
        </div>

        <div className="signup-container">
          <div className="signup-header">
            <h1>Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email</label>

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>

              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <Link className="back-to-login-link" to="/login">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignUp;