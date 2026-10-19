
import "./LoginPage.css";
import { useState } from "react";

function LoginPage({ onLogin }) {

  const [email, setEmail] = useState("");
 function handleSubmit(event) {
  event.preventDefault();
  onLogin(email.trim().toLowerCase());
}

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>TaskFlow</h1>

        <p className="subtitle">
          A simpler way to manage your day.
        </p>

        <h2>Welcome back</h2>

        <p className="description">
          Enter your details to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

           <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
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
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit">Log in</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
