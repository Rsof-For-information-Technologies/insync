export interface Tenant {
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
}

export type GetAllTenantsResponse = Tenant[];
