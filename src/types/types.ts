export type APIError = {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
};

export type LoginPayload = {
  userid: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
};

export type AuthResponse = {
  statuscode: number;
  message: string;
  data: {
    access_token: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    profileUpdated: boolean;
  };
};

export type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

export type RefreshPayload = {
  refreshToken: string | null;
};
