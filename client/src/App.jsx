
import { useEffect, useRef, useState } from "react";
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

  const nameRef = useRef(null);

  // Focus the username input whenever the popup opens.
  useEffect(() => {
    if (isPopupOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isPopupOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    handleLogin();

    if (!userName.trim()) {
      setIsPopupOpen(true);
    }
  }

  function handleSaveName(event) {
    event.preventDefault();

    const trimmedName = nameRef.current?.value.trim() || "";

    if (!trimmedName) {
      nameRef.current?.focus();
      return;
    }

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
                ref={nameRef}
                id="userName"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="off"
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
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="new-password"
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
