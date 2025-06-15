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
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
  };
};

export type FailedRequest = {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
};

export type RefreshPayload = {
  refreshToken: string | null;
};
