import { tenantApiCall } from "@/config/api";
import { CreateProjectRequest, CreateProjectResponse } from "@/types/project/createProject";
import { GetAllProjectsResponse } from "@/types/project/getAllProjects";
import { GetProjectByIdRequest, GetProjectByIdResponse } from "@/types/project/getProjectById";
import { UpdateProjectRequest, UpdateProjectResponse } from "@/types/project/updateUser";
import { UpdateUserRequest, UpdateUserResponse } from "@/types/user/updateUser";

export const getAllProjects = async (): Promise<GetAllProjectsResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetAllProjectsResponse>('/ProjectModel');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (payload: CreateProjectRequest): Promise<CreateProjectResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.post<CreateProjectResponse>('/ProjectModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProject = async (payload: UpdateProjectRequest): Promise<UpdateProjectResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.put<UpdateProjectResponse>('/ProjectModel', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (payload: GetProjectByIdRequest): Promise<GetProjectByIdResponse> => {
  const api = tenantApiCall();
  try {
    const { data } = await api.get<GetProjectByIdResponse>(`/ProjectModel/by-id/${payload.id}`);
    return data;
  } catch (error) {
    throw error;
  }
};
