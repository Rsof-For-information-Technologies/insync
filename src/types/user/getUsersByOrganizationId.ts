import { ApiBaseResponse } from "..";

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

export type UserByOrganizationIdResponse = ApiBaseResponse<User[]>;