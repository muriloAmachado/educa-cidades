import axios from "axios";

const api = axios.create({
  baseURL: "https://plf-es-2025-2-ti4-1254100-gestaoeduca.onrender.com", // backend Spring Boot
});

export default api;
