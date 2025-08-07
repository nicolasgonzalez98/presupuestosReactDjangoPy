import { useState, useEffect } from "react";

const AUTH_KEY = "authData";

export default function useAuth() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : { user: null, access: null, refresh: null };
  });

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth]);

  return {
    auth,
    isAuthenticated: !!auth.access,
  };
}
