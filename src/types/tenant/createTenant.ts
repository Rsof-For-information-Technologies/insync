export interface CreateTenantRequest {
  name: string;
  domain: string;
}

export interface CreateTenantResponse {
  succeeded: boolean;
  message: string;
  data: {
    name: string;
    domain: string;
    id: string;
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
