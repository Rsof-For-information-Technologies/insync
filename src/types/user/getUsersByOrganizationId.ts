export interface UserByOrganizationIdRequest {
  organizationId: string;
}

export interface UserByTenantIdRequest {
  tenantId: string;
}
export interface User {
  tenantId: string;
  organizationId: string;
  userId: string;
  email: string;
  isActive: boolean;
  isInvitationSent: boolean;
  isInvitationAccept: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}
export interface UserByOrganizationIdResponse {
  data: User[];
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}

