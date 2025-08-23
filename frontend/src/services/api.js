import axios from "axios";

const api = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL: api });

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
