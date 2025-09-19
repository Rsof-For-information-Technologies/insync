import { tenantApiCall } from '@/config/api';
import type { GetAllOrganizationResponse } from '@/types/organization/getAllOrganization';
import type { OrganizationByIdRequest } from '@/types/organization/getOrganizationById';

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
    const { data } = await api.get<OrganizationByIdRequest>(`/OrganizationModel/Get/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

