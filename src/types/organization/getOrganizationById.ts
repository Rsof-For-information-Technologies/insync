export type OrganizationByIdRequest = {
  id: string;
  name: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
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
