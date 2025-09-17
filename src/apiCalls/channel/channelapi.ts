import { apiCall } from '@/config/api';
import type { CreateChannelRequest, CreateChannelResponse } from '@/types/channel/createChannel';

// create API for Channel
export const registerChannel = async (payload: CreateChannelRequest): Promise<CreateChannelResponse> => {
  const api = apiCall();
  try {
    const response = await api.post<CreateChannelResponse>('/ChannelConfig/Create', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
