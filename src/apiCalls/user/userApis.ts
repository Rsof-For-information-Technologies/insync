import { tenantApiCall } from "@/config/api";
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
    const { data } = await api.get<UserByIdResponse>(`/BusinessOrgUserModel/Get/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
