import {useAuth} from "./Context/AuthContext";
import "./App.css";
import TaskPage from "./pages/TaskPage";

function App() {

  const { isLoggedIn, handleLogin } = useAuth();

  if (isLoggedIn) {
  return <TaskPage />;
}

function handleSubmit(event) {
  event.preventDefault();
  handleLogin();
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
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit">Log in</button>
        </form>
      </section>
    </main>
  );
}

export default App;
