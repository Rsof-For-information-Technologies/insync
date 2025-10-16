import { tenantApiCall } from "@/config/api";
import { CreateUserRequest, CreateUserResponse } from "@/types/user/createUser";
import { GetAllUsersResponse } from "@/types/user/getAllUsers";
import { GetUserByIdRequest, GetUserByIdResponse } from "@/types/user/getUserById";
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user/updateUser";

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetAllUsersResponse>('/BusinessOrgUserModel');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateUserResponse>('/BusinessOrgUserModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (payload: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.put<UpdateUserResponse>('/BusinessOrgUserModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (payload: GetUserByIdRequest): Promise<GetUserByIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetUserByIdResponse>(`/BusinessOrgUserModel/${payload.id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
