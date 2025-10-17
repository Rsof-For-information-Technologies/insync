import { ApiBaseResponse } from "..";
export interface CreateTenantRequest {
  name: string;
  domain: string;
}
export interface Tenant {
  name: string;
  domain: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}
export type CreateTenantResponse = ApiBaseResponse<Tenant | null>
