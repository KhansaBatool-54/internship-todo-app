
import "./SignupPage.css";
import { useState } from "react";

function SignupPage({ onSignup, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const data = await onSignup(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      setSuccess(data.message || "Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signup-page">
      <section className="signup-card">
        <h1>TaskFlow</h1>

        <p className="subtitle">
          A simpler way to manage your day.
        </p>

        <h2>Create your account</h2>

        <p className="description">
          Enter your details to get started.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email address</label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
            
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <button type="button" onClick={onGoToLogin}>
            Log in
          </button>
        </p>
      </section>
    </main>
  );
}

export default SignupPage;
