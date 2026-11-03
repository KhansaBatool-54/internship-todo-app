
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";

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

  // SIGNUP
  async function handleSignup(name, email, password) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // LOGIN
  async function handleLogin(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save authentication data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("token", data.token);

      // Update React state
      setIsLoggedIn(true);
      setUserEmail(data.user.email);
      setUserNameState(data.user.name);

      return data;
    } catch (error) {
      throw error;
    }
  }

  // LOGOUT
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setUserEmail("");
    setUserNameState("");
  }

  // Keep this temporarily for compatibility with existing components
  function setUserName(name) {
    localStorage.setItem("userName", name);
    setUserNameState(name);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        handleSignup,
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
