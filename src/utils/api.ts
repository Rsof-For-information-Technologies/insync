import type { LoginRequest } from '@/types/login';
import { LoginResponse } from '@/types/login';
import { UpdatePasswordResponse } from '@/types/updatePassword';
import { GetUserById, GetUsers, UpdateUserRequest, UpdateUserResponse } from '@/types/user';
import { getCookie, removeCookie } from '@/utils/cookieStorage';
import { ChangePasswordSchema } from '@/validators/updatePaseword.schema';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const apiCall = () => {
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

// Auth API functions

export const UserLoginForm = async (state: {
  email: string;
  password: string
}) => {
  const api = apiCall();
  try {
    const payload: LoginRequest = {
      email: state.email,
      password: state.password,
      fcmToken: 'static-fcm-token',
      deviceType: 'web',
    };
    const response = await api.post<LoginResponse>('/api/v1/user/login', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserRegisterForm = async (state: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/register', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserForgotPasswordForm = async (state: {
  email: string;
  clientUrl: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/forgot-password', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserResetPasswordForm = async (state: {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const api = apiCall();

  try {
    const response = await api.post('/api/v1/user/reset-password', state);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UserUpdatePassword = async (data: ChangePasswordSchema): Promise<UpdatePasswordResponse> => {
  const api = apiCall();
  try {
    const response = await api.put<UpdatePasswordResponse>('/api/v1/user/update-password', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// getAllUsers api

export const getAllUsers = async (pageNumber = 1, pageSize = 10): Promise<GetUsers> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetUsers>(`/api/v1/user/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return data;
  } catch (error) {
    console.error('Get all users failed:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<GetUserById> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetUserById>(`/api/v1/user/users/${id}`);
    return data;
  } catch (error) {
    console.error('Get user by ID failed:', error);
    throw error;
  }
};

export const updateUser = async (userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.put<UpdateUserResponse>('/api/v1/user/update-user', userData);
    return data;
  } catch (error) {
    console.error('Update user failed:', error);
    throw error;
  }
};
