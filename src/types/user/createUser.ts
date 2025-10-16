export interface CreateUserRequest {
  tenantId: string;
  organizationId: string;
  userId: string;
  email: string;
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
export interface CreateUserResponse {
  data: User;
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
