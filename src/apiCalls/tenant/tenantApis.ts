import { tenantApiCall } from '@/config/api';
import { OrganizationByTenantIdRequest, OrganizationByTenantIdResponse } from '@/types/organization/getOrganizationByTenantId';
import type { CreateTenantRequest, CreateTenantResponse } from '@/types/tenant/createTenant';
import type { GetAllTenantsResponse } from '@/types/tenant/getAllTenant';
import type { GetTenantsByIdResponse, TenantIdRequest } from '@/types/tenant/getTenantById';
import type { UpdateTenantRequest, UpdateTenantResponse } from '@/types/tenant/updateTenant';

// Get all tenants (client-side)
export const getAllTenants = async (): Promise<GetAllTenantsResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetAllTenantsResponse>('/TenantModel');
    return data;
  } catch (error) {
    throw error;
  }
};

// Get tenant by id (client-side)
export const getTenantById = async (payload: TenantIdRequest): Promise<GetTenantsByIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetTenantsByIdResponse>(`TenantModel/by-id/${payload.id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

// Update tenant status (client-side)
export const updateTenant = async (payload: UpdateTenantRequest): Promise<UpdateTenantResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.put<UpdateTenantResponse>('/TenantModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// Create tenant (client-side)
export const createTenant = async (payload: CreateTenantRequest): Promise<CreateTenantResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateTenantResponse>('/TenantModel/Create', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

// Get all organizations by tenant ID (client-side)
export const getAllOrganizationsByTenantId = async ( payload: OrganizationByTenantIdRequest ): Promise<OrganizationByTenantIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<OrganizationByTenantIdResponse>( `/OrganizationModel/by-tenantId/${payload.id}` );
    return data;
  } catch (error) {
    throw error;
  }
};
