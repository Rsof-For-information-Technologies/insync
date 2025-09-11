import { getCookie, removeCookie } from '@/utils/cookieStorage';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const apiCall = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  });

  instance.interceptors.request.use((config) => {
    let token = null;
    if (typeof window !== 'undefined') {
      token = getCookie("access_token");
      if (!token) {
        token = localStorage.getItem("authToken");
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = "true";
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user-info");
          removeCookie("access_token");
          removeCookie("refresh_token");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/auth/login";
          }
        }
      } else if (error.response?.status === 403) {
        console.error("Access forbidden. Please check your permissions or authentication.");
        toast.error("Access forbidden. Please check your permissions.");
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
