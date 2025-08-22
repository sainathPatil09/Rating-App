import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) setAuthUser(JSON.parse(storedUser));
    setLoading(false); // <-- done loading after checking localStorage
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setAuthUser(userData);

    // Redirect based on role
    if (userData.role === "ADMIN") navigate("/admin");
    else if (userData.role === "OWNER") navigate("/owner");
    else navigate("/stores");
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    setAuthUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
