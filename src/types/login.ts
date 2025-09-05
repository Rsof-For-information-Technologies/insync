export type LoginResponse = {
  succeeded: boolean;
  message: string;
  validationResultModel: string | null;
  data: {
    token: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    refreshToken: string;
  };
};

export type LoginRequest = {
  email: string;
  password: string;
  fcmToken: string;
  deviceType: 'web' | 'ios' | 'android' | string;
};
