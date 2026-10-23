
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(
  () => localStorage.getItem("isLoggedIn") === "true"
);

  const [userEmail, setUserEmail] = useState(
  () => localStorage.getItem("userEmail") || ""
);

  const [userName, setUserNameState] = useState(
    () => localStorage.getItem("userName") || ""
  );

function handleLogin(email) {
  const Email = email.trim().toLowerCase();

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", Email);

  setUserEmail(Email);
  setIsLoggedIn(true);
}

  function handleLogout() {
    // Loop through localStorage to remove all user-specific notes storage keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("notesApiLabNotes_")) {
        localStorage.removeItem(key);
      }
    });

    // Clear standard auth items
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setUserEmail("");
    setUserNameState("");
  }

  function setUserName(name) {
    localStorage.setItem("userName", name);
    setUserNameState(name);
  }

  return (
    <AuthContext.Provider
      value={{
  isLoggedIn,
  handleLogin,
  handleLogout,
  userName,
  setUserName,
  userEmail,
}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
