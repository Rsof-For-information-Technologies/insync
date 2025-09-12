import { apiCall } from '@/config/api';
import type { LoginRequest, LoginResponse } from '@/types/auth/login';
import type { SignupRequest, SignupResponse } from '@/types/auth/signup';
import type { ForgotPasswordRequest, ForgotPasswordResponse } from '@/types/auth/forgotPassword';
import type { ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth/resetPassword';
import type { ChangePasswordRequest, ChangePasswordResponse } from '@/types/profile/changePassword';
import { ChangePasswordSchema } from '@/validators/profile/updatePassword';

// New registration API for User Management
export const registerUser = async (payload: SignupRequest): Promise<SignupResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<SignupResponse>('/api/v1/UserManagement/register', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement login API
export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<LoginResponse>('/api/v1/UserManagement/login', payload);
    console.log("bfudcbudbfuhdbufbduf", response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement forgot password API
export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<ForgotPasswordResponse>('/api/v1/UserManagement/forgot-password', payload);
    console.log("dfjdfjhdjfhdfhdfjdhfjhdjfhdjf", response)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement reset password API
export const resetPassword = async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<ResetPasswordResponse>('/api/v1/UserManagement/reset-password', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement change password API
export const changePassword = async (payload: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<ChangePasswordResponse>('/api/v1/UserManagement/change-password', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
