import { channelHubApiCall } from '@/config/api';
import type { CreateChatbotRequest, CreateChatbotResponse } from '@/types/chatbot/createChatbot';
import type { UpdateChatbotRequest, UpdateChatbotResponse } from '@/types/chatbot/updateChatbot';
import type { GetAllChatbotResponse } from '@/types/chatbot/showAllChatbots';

// create API for Chatbot
export const registerChatbot = async (payload: CreateChatbotRequest): Promise<CreateChatbotResponse> => {
  const api = channelHubApiCall();
  try {
    const response = await api.post<CreateChatbotResponse>('/Chatbot/Create', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get API for all Chatbots
export const getAllChatbots = async (): Promise<GetAllChatbotResponse> => {
  const api = channelHubApiCall();
  try {
    const { data } = await api.get<GetAllChatbotResponse>('/Chatbot/GetAll');
    return data;
  } catch (error) {
    throw error;
  }
};


// Update chatbot info (client-side)
export const updateChatbot = async (payload: UpdateChatbotRequest): Promise<UpdateChatbotResponse> => {
  const api = channelHubApiCall();
  try {
    const { data } = await api.put<UpdateChatbotResponse>('/Chatbot/Update', payload);
    return data;
  } catch (error) {
    throw error;
  }
};
