import { tenantApiCall } from '@/config/api';
import { CreateOrganizationRequest, CreateOrganizationResponse } from '@/types/organization/createOrganization';
import type { GetAllOrganizationResponse } from '@/types/organization/getAllOrganization';
import type { OrganizationByIdResponse } from '@/types/organization/getOrganizationById';
import { OrganizationByTenantIdRequest } from '@/types/organization/getOrganizationByTenantId';
import { UpdateOrganizationRequest, UpdateOrganizationResponse } from '@/types/organization/updateOrganization';
import { UserByOrganizationIdResponse, UserByOrganizationIdRequest, UserByTenantIdRequest } from '@/types/user/getUsersByOrganizationId';

// create organizations (client-side)
export const createOrganization = async (payload: CreateOrganizationRequest): Promise<CreateOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateOrganizationResponse>('/OrganizationModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update organizations (client-side)
export const updateOrganization = async (payload: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const response = await api.put<UpdateOrganizationResponse>('/OrganizationModel', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all organizations (client-side)
export const getAllOrganizations = async (): Promise<GetAllOrganizationResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetAllOrganizationResponse>('/OrganizationModel');
    return data;
  } catch (error) {
    throw error;
  }
};

// Get organization by id (client-side)
export const getOrganizationById = async (payload: OrganizationByTenantIdRequest): Promise<OrganizationByIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<OrganizationByIdResponse>(`/OrganizationModel/by-id/${payload.id}`);
    return data;
  } catch (error) {
    throw error;
  }
};


export const getAllUsersByOrganizationId = async ( payload: UserByOrganizationIdRequest ): Promise<UserByOrganizationIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<UserByOrganizationIdResponse>( `/BusinessOrgUserModel/Organization/${payload.organizationId}` );
    return data;
  } catch (error) {
    throw error;
  }
};
