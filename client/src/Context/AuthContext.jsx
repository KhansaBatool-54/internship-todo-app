
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
  const normalizedEmail = email.trim().toLowerCase();

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", normalizedEmail);

  setUserEmail(normalizedEmail);
  setIsLoggedIn(true);
}

  function handleLogout() {
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
