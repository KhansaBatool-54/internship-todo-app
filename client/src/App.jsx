
import { useState } from "react";
import { useAuth } from "./Context/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskPage from "./pages/TaskPage";
import NotesPage from "./pages/NotesPage";

function App() {
  const {
    isLoggedIn,
    handleLogin,
    handleSignup,
  } = useAuth();

  // Controls Login / Signup screens
  const [authPage, setAuthPage] = useState("login");

  // Controls Tasks / Notes screens
  const [currentPage, setCurrentPage] = useState("tasks");

  // Show login or signup when user is not logged in
  if (!isLoggedIn) {
    return (
      <>
        {authPage === "login" ? (
          <LoginPage
            onLogin={handleLogin}
            onGoToSignup={() => setAuthPage("signup")}
          />
        ) : (
          <SignupPage
            onSignup={handleSignup}
            onGoToLogin={() => setAuthPage("login")}
          />
        )}
      </>
    );
  }

  // Show application after successful login
  return (
    <main>
      {currentPage === "tasks" ? (
        <TaskPage
          onOpenNotes={() => setCurrentPage("notes")}
        />
      ) : (
        <NotesPage
          onBack={() => setCurrentPage("tasks")}
        />
      )}
    </main>
  );
}

export default App;
