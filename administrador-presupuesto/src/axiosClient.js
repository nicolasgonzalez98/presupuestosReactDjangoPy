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
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const authData = getAuth();
      if (!authData?.refresh) {
        logout();
        return Promise.reject(error);
      }

      try {
        // usamos axiosClient o axios con baseURL manual
        const { data } = await axiosClient.post("/token/refresh/", {
          refresh: authData.refresh,
        });

        // actualizamos tokens en localStorage
        login({
          ...authData,
          access: data.access,
          refresh: data.refresh || authData.refresh, // por si devuelve refresh nuevo
        });

        // reintentamos la request original
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
