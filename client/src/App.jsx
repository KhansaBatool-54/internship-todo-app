
import { useEffect, useState } from "react";
import { useAuth } from "./Context/AuthContext";
import LoginPage from "./pages/LoginPage";
import TaskPage from "./pages/TaskPage";
import Popup from "./pages/Popup";

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
    <>
      <TaskPage />

      {isPopupOpen && (
        <Popup
          onSave={handleSaveName}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
}

export default App;
