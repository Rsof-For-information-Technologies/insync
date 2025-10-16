export interface UpdateTenantRequest {
  id: string;
  isActive: boolean;
}
export interface UpdateTenantResponse {
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
