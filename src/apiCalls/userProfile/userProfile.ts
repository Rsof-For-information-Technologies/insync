import { connectApiCall } from '@/config/api';
import { GetProfileRequest, GetProfileResponse } from '@/types/profile/getProfile';
import { UpdateProfileRequest, UpdateProfileResponse } from '@/types/profile/updateProfile';

export const getProfile = async (payload: GetProfileRequest): Promise<GetProfileResponse> => {
  const api = connectApiCall();
  try {
    const { data } = await api.get<GetProfileResponse>('/UserProfile/GetProfile', { params: payload });
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (payload: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const api = connectApiCall();
  try {
    const formData = new FormData();
    formData.append('UserId', payload.UserId ?? '');
    formData.append('FirstName', payload.FirstName ?? '');
    formData.append('LastName', payload.LastName ?? '');
    formData.append('PhoneNumber', payload.PhoneNumber ?? '');

    if (payload.ProfilePicture instanceof File) {
      formData.append('ProfilePicture', payload.ProfilePicture);
    } else if (payload.ProfilePicture) {
      formData.append('ProfilePicture', payload.ProfilePicture as string);
    }
    const { data } = await api.put<UpdateProfileResponse>('/UserProfile/UpdateProfile', formData);
    return data;
  } catch (error) {
    throw error;
  }
};

