import { ApiBaseResponse } from "..";

export interface TenantIdRequest {
  id: string;
}
export interface Tenant {
  name: string;
  domain: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}

export type GetTenantsByIdResponse = ApiBaseResponse<Tenant>;
  