import axios from "axios"; 

// localhost and OR API_URL for mentain code
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ 
  baseURL: API,
  withCredentials: true, 
});

export default api;
