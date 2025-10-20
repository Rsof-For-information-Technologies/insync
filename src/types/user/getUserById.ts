import { ApiBaseResponse } from "..";

export interface GetUserByIdRequest {
  id: string;
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

export type GetUserByIdResponse = ApiBaseResponse<User>;
