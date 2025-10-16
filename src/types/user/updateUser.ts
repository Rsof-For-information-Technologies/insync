export interface UpdateUserRequest {
  id: string;
  isActive: boolean;
  isInvitationSent: boolean;
  isInvitationAccept: boolean;
}
export interface UpdateUserResponse {
  success: boolean;
  statusCode: string;
  message: string;
  successes: string[];
  errors: any[];
  validationErrors: Record<string, any>;
}
