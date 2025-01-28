import axios from "axios";



const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});







export default apiClient;
