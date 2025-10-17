import { ApiBaseResponse } from "..";

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
export type GetAllUsersResponse = ApiBaseResponse<Users[]>