export interface OrganizationByTenantIdRequest {
  tenantId: string;
}

export interface OrganizationData {
  name: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
  id: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string;
}

export interface OrganizationByTenantIdResponse {
  succeeded: boolean;
  message: string;
  data: OrganizationData[];
}
