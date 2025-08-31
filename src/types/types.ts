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

export type ResetPasswordPayload = {
  email: string;
  password: string;
  confirm_password: string;
  otp: string;
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

export type CreateSeedletPayload = {
  title: string;
  description: string;
  tags: string[];
  neededRoles: string[];
};

export interface Tag {
  id: string;
  name: string;
}

export interface Owner {
  id: string;
  username: string;
}

export interface Seedlet {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  neededRoles: string[];
  ownerId?: string;
  owner?: Owner;
  likeCount: number;
  commentCount: number;
  interestCount: number;
  likedByCurrentUser: boolean;
  interestedByCurrentUser: boolean;
}

export interface User {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  ownerId?: string;
  owner?: User;
  parentId?: string;
  likeCount: number;
  isLikedByUser?: boolean;
  createdAt: string;
}

export type Reply = Comment;

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
  ownerId?: string;
  owner?: User;
  neededRoles: string[];
  likeCount: number;
  interestCount: number;
  commentCount: number;
  isLikedByUser?: boolean;
}

export type ReplyThreadProps = {
  reply: Reply;
  ideaId: string;
  parentId: string;
  depth?: number;
};
