export interface UserByOrganizationIdRequest {
  organizationId: string;
}

export interface UserData {
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

export interface UserByOrganizationIdResponse {
  succeeded: boolean;
  message: string;
  data: UserData[];
}
