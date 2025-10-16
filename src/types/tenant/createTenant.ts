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
export interface CreateTenantResponse {
  data: Tenant;
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
