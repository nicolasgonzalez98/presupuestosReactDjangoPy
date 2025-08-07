import axios from 'axios'


axios.defaults.withCredentials = false

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

const axiosAuth = axios.create({
    baseURL: getBaseURL(),
})

axiosAuth.defaults.headers.common['Accept'] = 'application/json'
axiosAuth.defaults.headers.common['Content-Type'] = 'application/json'
axiosAuth.defaults.headers.common['X-Requested-with'] = 'XMLHttpRequest'


export default axiosAuth
