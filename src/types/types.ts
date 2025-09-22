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

export interface Interest {
  id?: string;
  ideaId?: string;
  userId?: string;
  roleInterestedIn?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seedlet {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  interests: Interest[];
  neededRoles: string[];
  ownerId?: string;
  owner?: Owner;
  likeCount: number;
  commentCount: number;
  interestCount: number;
  likedByCurrentUser: boolean;
  currentUserHasInterest: boolean;
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
  commentCount: number;
  likedByCurrentUser?: boolean;
  createdAt: string;
  replies?: Reply[];
}

export type Reply = Comment;

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: { id: string; name: string }[];
  ownerId?: string;
  owner?: User;
  interests: Interest[];
  neededRoles: string[];
  likeCount: number;
  interestCount: number;
  commentCount: number;
  likedByCurrentUser?: boolean;
  currentUserHasInterest: boolean;
}

export type ReplyThreadProps = {
  reply: Reply;
  ideaId: string;
  parentId: string;
  depth?: number;
};

export type RolePickerProps = {
  seedlet: Idea;
  userId?: string;
  isOwner: boolean;
  isLoading: boolean;
  selectedRole?: string;
  onSelectRole: (role: string) => void;
  onClose: () => void;
};

export type SSEMessage =
  | { ref: "idea"; refId: string; liked: boolean }
  | { ref: "idea"; refId: string; reply: CommentReply }
  | { ref: "idea"; refId: string; interested: boolean }
  | { ref: "idea"; created: Seedlet };

// Comment event type
export interface CommentReply {
  id: string;
  content: string;
  ownerId?: string;
  owner?: User;
  parentId?: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser?: boolean;
  createdAt: string;
  replies?: CommentReply[];
}

// React-query caches types
export type FeedCache = { data: Seedlet[] };
export type DetailCache = { data: { idea: Seedlet; comments: CommentReply[] } };
export type CommentCache = { data: { comments: CommentReply[] } };

export type IdeaResponse = { data: { idea: Seedlet } } | Seedlet;
