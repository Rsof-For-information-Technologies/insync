import { tenantApiCall } from "@/config/api";
import { CreateUserRequest, CreateUserResponse } from "@/types/user/createUser";
import { GetAllUsersResponse } from "@/types/user/getAllUsers";
import { UserByIdResponse } from "@/types/user/getUserById";
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user/updateUser";

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const api = tenantApiCall();
  try {
    const response = await api.get< { data : GetAllUsersResponse }>('/BusinessOrgUserModel/GetAll');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateUserResponse>('/BusinessOrgUserModel/Create', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (payload: UpdateUserRequest): Promise<UpdateUserResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.put<UpdateUserResponse>('/BusinessOrgUserModel/Update', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string): Promise<UserByIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<{ data: UserByIdResponse }>(`/BusinessOrgUserModel/Get/${id}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};
