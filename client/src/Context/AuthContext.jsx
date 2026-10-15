import {createContext ,useContext , useState} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
  () => localStorage.getItem("isLoggedIn") === "true"
);

function handleLogin() {
  localStorage.setItem("isLoggedIn", "true");
  setIsLoggedIn(true);
}

function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
}
    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
  return useContext(AuthContext);
}
