import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import Popup from "./pages/Popup";
import NotesPage from "./pages/NotesPage";

function App() {
  const {
    isLoggedIn,
    handleLogin,
    userName,
    setUserName,
  } = useAuth();

  const [isPopupOpen, setIsPopupOpen] = useState(
    () =>
      localStorage.getItem("isLoggedIn") === "true" && !localStorage.getItem("userName")
  );

  const [currentPage, setCurrentPage] = useState("tasks");

  useEffect(() => {
    if (isLoggedIn && !userName.trim()) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [isLoggedIn, userName]);

  function handleSaveName(name) {
    setUserName(name);
    setIsPopupOpen(false);
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main>
      {currentPage === "tasks" ? (
        <TaskPage onOpenNotes={() => setCurrentPage("notes")} />
      ) : (
        <NotesPage onBack={() => setCurrentPage("tasks")} />
      )}

      {isPopupOpen && (
        <Popup
          onSave={handleSaveName}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </main>
  );
}

export default App;