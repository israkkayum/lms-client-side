import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { handleApiError } from "../utils/helpers";

const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging in development
axiosPublic.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosPublic.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = handleApiError(error);
    
    if (import.meta.env.DEV) {
      console.error("API Error:", errorMessage, error);
    }
    
    // Attach user-friendly message to error
    error.userMessage = errorMessage;
    return Promise.reject(error);
  }
);

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
