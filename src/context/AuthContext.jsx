import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on page load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("rro_token");
      const storedUser = localStorage.getItem("rro_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("rro_token");
      localStorage.removeItem("rro_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("rro_token", jwtToken);
    localStorage.setItem("rro_user", JSON.stringify(userData));
  };

  const updateUser = (updatedFields) => {
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem("rro_user", JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rro_token");
    localStorage.removeItem("rro_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};