import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AUTH_KEY = "authData";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : { user: null, access: null, refresh: null };
  });

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = (data) => {
    setAuth({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuth({ user: null, access: null, refresh: null });
  };

  const isAuthenticated = !!auth.access;

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
    