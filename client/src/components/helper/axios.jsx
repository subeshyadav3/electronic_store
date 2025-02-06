import axios from "axios";



const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", 
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//       if (error.response.status === 401){
//           try {
//               await axios.get("http://localhost:3000/api/auth/refresh", { withCredentials: true });
//               return apiClient(error.config); 
//           } catch (refreshError) {
//               return Promise.reject(refreshError);
//           }
//       }
//       return Promise.reject(error);
//   }
// );






export default apiClient;
