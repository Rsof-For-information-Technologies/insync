import { ApiBaseResponse } from "..";

export interface UpdateOrganizationRequest {
  id: string;
  phone: string;
  industryType: string;
  email: string;
  country: string;
}

export type UpdateOrganizationResponse = ApiBaseResponse<null>;
  
