// src/lib/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("atom.auth.token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  // devolve o dado limpo — o service não precisa lembrar do .data
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("atom.auth.user");
      localStorage.removeItem("atom.auth.token");
      window.location.assign("/login");
    }

    const message = error.response?.data?.message ?? "Não foi possível concluir a operação.";
    return Promise.reject(new Error(message));
  },
);
