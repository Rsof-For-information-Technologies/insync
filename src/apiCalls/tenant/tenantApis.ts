import { apiCall } from '@/config/api';
import type { GetAllTenantsResponse } from '@/types/tenant/getAllTenant';
import type { TenantById } from '@/types/tenant/getTenantById';
import type { UpdateTenantRequest, UpdateTenantResponse } from '@/types/tenant/updateTenant';

// Get all tenants (client-side)
export const getAllTenants = async (): Promise<GetAllTenantsResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.get<GetAllTenantsResponse>('/TenantModel/GetAll');
    return data;
  } catch (error) {
    throw error;
  }
};

// Get tenant by id (client-side)
export const getTenantById = async (id: string): Promise<TenantById> => {
  const api = apiCall();
  try {
    const { data } = await api.get<TenantById>(`/TenantModel/Get/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update tenant status (client-side)
export const updateTenant = async (payload: UpdateTenantRequest): Promise<UpdateTenantResponse> => {
  const api = apiCall();
  try {
    const { data } = await api.put<UpdateTenantResponse>('/TenantModel/Update', payload);
    return data;
  } catch (error) {
    throw error;
  }
};
