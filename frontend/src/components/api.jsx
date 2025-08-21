import axios from "axios"; 

// most import to use localhost and OR so that best for meantain code
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ 
  baseURL: API,
  withCredentials: true, 
});

export default api;
