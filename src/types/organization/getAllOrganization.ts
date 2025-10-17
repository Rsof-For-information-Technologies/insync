import { ApiBaseResponse } from "..";

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

export type GetAllOrganizationResponse = ApiBaseResponse<Organization[]>;