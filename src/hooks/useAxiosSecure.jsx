import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { API_BASE_URL } from "../utils/constants";
import { handleApiError } from "../utils/helpers";

const axiosSecure = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  // request interceptor to add authorization header for every secure call to teh api
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      if (import.meta.env.DEV) {
        console.log(`Secure API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // intercepts 401 and 403 status
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response?.status;
      
      const errorMessage = handleApiError(error);
      
      if (import.meta.env.DEV) {
        console.error("Secure API Error:", errorMessage, error);
      }
      
      // Attach user-friendly message to error
      error.userMessage = errorMessage;
      
      // for 401 or 403 logout the user and move the user to the login
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      }
      
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
