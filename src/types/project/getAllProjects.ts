import { ApiBaseResponse } from "..";

export interface Projects {
  name: string;
  description: string;
  organizationId: string;
  isActive: boolean;
  id: string;
  rowVersion: string;
  domainEvents: string[];
}

export type GetAllProjectsResponse = ApiBaseResponse<Projects[]>
