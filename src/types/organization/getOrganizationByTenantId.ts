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
export interface OrganizationByTenantIdResponse {
  data: Organization[];
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
