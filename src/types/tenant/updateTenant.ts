import { ApiBaseResponse } from "..";

export interface UpdateTenantRequest {
  id: string;
  isActive: boolean;
}
export type UpdateTenantResponse = ApiBaseResponse<null>
