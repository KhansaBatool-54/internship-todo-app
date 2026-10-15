
import './App.css'

function App() {
  return (
    <main className="login-page">
      <section className="login-card">
        <h1>TaskFlow</h1>
        <p className="subtitle">A simpler way to manage your day.</p>

        <h2>Welcome back</h2>
        <p className="description">
          Enter your details to continue.
        </p>

        <form>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit">Log in</button>
        </form>
      </section>
    </main>
  )
}

export default App
