import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    console.log("Interceptor working for:", config.url);
    const auth = localStorage.getItem("auth");

    if (auth) {
      const user = JSON.parse(auth);
      const token = user?.jwtToken || user?.token || user?.accessToken;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
