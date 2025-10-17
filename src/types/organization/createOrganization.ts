import { ApiBaseResponse } from "..";

export interface CreateOrganizationRequest {
  name: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
  tenantId: string;
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

export type CreateOrganizationResponse = ApiBaseResponse<Organization>;
