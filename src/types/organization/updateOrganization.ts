export interface UpdateOrganizationRequest {
  id: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
}

export interface UpdateOrganizationResponse {
  succeeded: boolean;
  message: string;
  data: {
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
  };
}
