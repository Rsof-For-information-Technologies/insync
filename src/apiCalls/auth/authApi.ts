import { connectApiCall } from '@/config/api';
import type { ForgotPasswordRequest, ForgotPasswordResponse } from '@/types/auth/forgotPassword';
import type { LoginRequest, LoginResponse } from '@/types/auth/login';
import type { ResetPasswordRequest, ResetPasswordResponse } from '@/types/auth/resetPassword';
import type { SignupRequest, SignupResponse } from '@/types/auth/signup';
import type { ChangePasswordRequest, ChangePasswordResponse } from '@/types/profile/changePassword';

// New registration API for User Management
export const registerUser = async (payload: SignupRequest | FormData): Promise<SignupResponse> => {
  const api = connectApiCall();
  try {
    const config = payload instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : undefined;
    const { data } = await api.post<SignupResponse>('/UserManagement/register', payload, config);
    console.log("registration response data", data);
    return data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement login API
export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const api = connectApiCall();
  try {
    const { data } = await api.post<LoginResponse>('/UserManagement/login', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement forgot password API
export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const api = connectApiCall();
  try {
    const { data } = await api.post<ForgotPasswordResponse>('/UserManagement/forgot-password', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement reset password API
export const resetPassword = async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const api = connectApiCall();
  try {
    const response = await api.post<ResetPasswordResponse>('/UserManagement/reset-password', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// New UserManagement change password API
export const changePassword = async (payload: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const api = connectApiCall();
  try {
    const { data } = await api.post<ChangePasswordResponse>('/UserManagement/change-password', payload);
    console.log("sdkskdjskdksd", data)
    return data;
  } catch (error) {
    throw error;
  }
};


