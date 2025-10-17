import { ApiBaseResponse } from "..";

export interface Tenant {
  name: string;
  domain: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}

export type GetAllTenantsResponse = ApiBaseResponse<Tenant[]>
