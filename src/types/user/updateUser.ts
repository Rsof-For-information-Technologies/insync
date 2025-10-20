import { ApiBaseResponse } from "..";

export interface UpdateUserRequest {
  id: string;
  isActive: boolean;
  isInvitationSent: boolean;
  isInvitationAccept: boolean;
}
export type UpdateUserResponse = ApiBaseResponse<null>
