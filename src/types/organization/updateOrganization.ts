export interface UpdateOrganizationRequest {
  id: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
}
export interface UpdateOrganizationResponse {
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
