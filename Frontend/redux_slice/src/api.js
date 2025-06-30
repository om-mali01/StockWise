import axios from "axios";

const API = axios.create({
  baseURL: "http://172.17.0.109:8000/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("tokentoken", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;