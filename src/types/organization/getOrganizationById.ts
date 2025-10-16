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
export interface OrganizationByIdResponse {
  data: Organization;
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
