import { apiCall } from '@/config/api';
import type { GetAllOrganizationResponse } from '@/types/organization/getAllOrganization';
import type { OrganizationByIdRequest } from '@/types/organization/getOrganizationById';

// Get all organizations (client-side)
export const getAllOrganizations = async (): Promise<GetAllOrganizationResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetAllOrganizationResponse>('/OrganizationModel/GetAll');
    return data;
  } catch (error) {
    throw error;
  }
};

// Get organization by id (client-side)
export const getOrganizationById = async (id: string): Promise<OrganizationByIdRequest> => {
  const api = apiCall();
  try {
    const { data } = await api.get<OrganizationByIdRequest>(`/OrganizationModel/Get/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

