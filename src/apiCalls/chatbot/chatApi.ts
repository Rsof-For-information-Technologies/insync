import { channelHubApiCall } from '@/config/api';
import type { CreateChatbotRequest, CreateChatbotResponse } from '@/types/chatbot/createChatbot';

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
