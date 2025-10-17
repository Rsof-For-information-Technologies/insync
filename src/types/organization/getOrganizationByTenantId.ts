import { ApiBaseResponse } from "..";

export interface OrganizationByTenantIdRequest {
  id: string;
}
export interface Organization {
  tenantId: string;
  name: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
  isActive: boolean;
  rowVersion: string;
  domainEvents: string[];
}
export type OrganizationByTenantIdResponse = ApiBaseResponse<Organization[]>;
