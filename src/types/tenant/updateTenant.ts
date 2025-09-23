export interface UpdateTenantRequest {
  id: string;
  isActive: boolean;
}

export interface UpdateTenantResponse {
  succeeded: boolean;
  message: string;
  data: {
    existEntity: {
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
  };
}
