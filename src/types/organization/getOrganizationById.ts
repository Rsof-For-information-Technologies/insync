import { ApiBaseResponse } from "..";

export interface TenantIdRequest {
  id: string;
}

export type Organization = {
  tenantId: string;
  name: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
};

export type OrganizationByIdResponse = ApiBaseResponse<Organization>;
