import axios from "axios";
import { getAuth, login, logout } from "./utils/authUtils";


const getBaseURL = () => {
  switch (window.location.hostname) {
    case "tuproyecto.com":
      return import.meta.env.VITE_API_PROD;
    case "test.tuproyecto.com":
      return import.meta.env.VITE_API_TEST;
    default:
      return import.meta.env.VITE_API_DEV || "http://localhost:8000/api";
  }
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// (opcional) Interceptor de request para añadir el token si existe
axiosClient.interceptors.request.use(
    (config) => {
      const auth = getAuth();
      if (auth?.access) {
        config.headers.Authorization = `Bearer ${auth.access}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// (opcional) Interceptor de respuesta para manejar 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si fue 401 y no es un intento de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = getAuth();
        const response = await axios.post(
          import.meta.env.VITE_API_DEV + "/token/refresh/",
          { refresh: auth.refresh }
        );

        const newAccess = response.data.access;

        // Actualizar token
        const newData = { ...auth, access: newAccess };
        login(newData);

        // Reintentar original request con nuevo token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (err) {
        // El refresh también falló: cerramos sesión
        logout();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
