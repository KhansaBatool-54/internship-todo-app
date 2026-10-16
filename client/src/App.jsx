
import { useState } from "react";
import { useAuth } from "./Context/AuthContext";
import TaskPage from "./pages/TaskPage";
import "./App.css";

function App() {
  const { isLoggedIn, handleLogin, userName, setUserName } = useAuth();

  const [isPopupOpen, setIsPopupOpen] = useState(
    () =>
      localStorage.getItem("isLoggedIn") === "true" &&
      !localStorage.getItem("userName")
  );

  const [nameInput, setNameInput] = useState(userName);

  function handleSubmit(event) {
  event.preventDefault();

  setNameInput("");
  handleLogin();

  if (!userName.trim()) {
    setIsPopupOpen(true);
  }
}

 function handleSaveName(event) {
  event.preventDefault();

  const trimmedName = nameInput.trim();

  if (!trimmedName) return;

  setUserName(trimmedName);
  setIsPopupOpen(false);
}

  if (isLoggedIn && isPopupOpen) {
    return (
      <main className="login-page">
        <section className="login-card username-popup">
          <h2>Welcome!</h2>
          <p className="description">
            Enter your username to continue.
          </p>

          <form onSubmit={handleSaveName}>
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                type="text"
                placeholder="Enter your username"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                required
              />
            </div>

            <button type="submit">Save</button>

            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
            >
              Close
            </button>
          </form>
        </section>
      </main>
    );
  }

  if (isLoggedIn) {
    return <TaskPage />;
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
