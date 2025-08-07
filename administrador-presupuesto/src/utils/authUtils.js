const AUTH_KEY = "authData";

export const getAuth = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const login = (data) => {
  const authData = {
    access: data.access,
    refresh: data.refresh,
    user: data.user,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};
