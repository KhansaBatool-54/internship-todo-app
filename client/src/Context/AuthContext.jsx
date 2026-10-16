
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [userName, setUserNameState] = useState(
    () => localStorage.getItem("userName") || ""
  );

  function handleLogin() {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
