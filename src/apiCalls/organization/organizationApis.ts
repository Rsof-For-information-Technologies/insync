import { tenantApiCall } from '@/config/api';
import { CreateOrganizationRequest, CreateOrganizationResponse } from '@/types/organization/createOrganization';
import type { GetAllOrganizationResponse } from '@/types/organization/getAllOrganization';
import type { OrganizationByIdRequest } from '@/types/organization/getOrganizationById';
import { UpdateOrganizationRequest, UpdateOrganizationResponse } from '@/types/organization/updateOrganization';
import { UserByOrganizationIdRequest, UserByOrganizationIdResponse } from '@/types/user/getUsersByOrganizationId';

// create organizations (client-side)
export const createOrganization = async (payload: CreateOrganizationRequest): Promise<CreateOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateOrganizationResponse>('/OrganizationModel/Create', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update organizations (client-side)
export const updateOrganization = async (payload: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const response = await api.put<UpdateOrganizationResponse>('/OrganizationModel/Update', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all organizations (client-side)
export const getAllOrganizations = async (): Promise<GetAllOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const response = await api.get<{ data: GetAllOrganizationResponse }>('/OrganizationModel/GetAll');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get organization by id (client-side)
export const getOrganizationById = async (id: string): Promise<OrganizationByIdRequest> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<{ data: OrganizationByIdRequest }>(`/OrganizationModel/Get/${id}`);
    return data.data;
  } catch (error) {
    throw error;
  }
};


export const getAllUsersByOrganizationId = async ( payload: UserByOrganizationIdRequest ): Promise<UserByOrganizationIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<UserByOrganizationIdResponse>( `/BusinessOrgUserModel/GetAllUsersByOrganizationId/${payload.organizationId}` );
    return data;
  } catch (error) {
    throw error;
  }
};
