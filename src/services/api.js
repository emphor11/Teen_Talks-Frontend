// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://teen-talks-backend.onrender.com/api/v1",
  // withCredentials:false by default; we'll not use cookies for now
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
