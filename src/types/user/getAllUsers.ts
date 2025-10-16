export interface Users {
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
export interface GetAllUsersResponse {
  data: Users[];
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
