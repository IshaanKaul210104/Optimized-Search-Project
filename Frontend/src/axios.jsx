import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // Matches your backend API
  headers: {
    "Content-Type": "application/json", // Use 'application/json' for standard requests
  },
});

// Optionally remove authorization header (if not needed for the app)
delete API.defaults.headers.common["Authorization"];

export default API;
