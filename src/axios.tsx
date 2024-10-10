import axios, { AxiosInstance, AxiosResponse } from "axios";
import { InternalAxiosRequestConfig } from "axios";

const instance: AxiosInstance = axios.create({
  // baseURL: "http://localhost/api",
  baseURL: "https://api.ploi.com.br/api",
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Se a resposta for bem-sucedida, simplesmente retorne a resposta
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se o erro for 401, deslogar o usuário
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("selectedEnvironment");
      localStorage.removeItem("selectedEnterprise");

      window.location.href = "/login";
    }

    // Retorne o erro para que você possa lidar com ele em outro lugar
    return Promise.reject(error);
  }
);

export default instance;
