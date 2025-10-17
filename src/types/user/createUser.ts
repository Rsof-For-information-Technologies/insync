import { ApiBaseResponse } from "..";

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
  
export type CreateUserResponse = ApiBaseResponse<User>;
  
