import apiRequest from "@/utils/api";
import { CreateSeedletPayload } from "@/types/types";

// Get all ideas (seedlets)
export const getIdeas = async () => {
  const res = await apiRequest.get("/ideas");
  return res.data;
};

// Create an idea
export const createIdea = async (payload: CreateSeedletPayload) => {
  const res = await apiRequest.post("/ideas", payload);
  return res.data;
};

// Get idea by id
export const getIdeaById = async (id: string) => {
  const res = await apiRequest.get(`/ideas/${id}`);
  return res.data;
};

// Update idea
export const updateIdea = async (
  id: string,
  payload: Partial<CreateSeedletPayload>
) => {
  const res = await apiRequest.patch(`/ideas/${id}`, payload);
  return res.data;
};

// Like an idea
export const likeIdea = async (id: string) => {
  const res = await apiRequest.post(`/ideas/${id}/likes`);
  return res.data;
};

// Show interest on an idea
export const showInterestOnIdea = async (
  id: string,
  payload: { roleInterestedIn: string }
) => {
  const res = await apiRequest.post(`/ideas/${id}/interests`, payload);
  return res.data;
};

// Comment on an idea
export const commentOnIdea = async (
  id: string,
  payload: { comment: string }
) => {
  const res = await apiRequest.post(`/ideas/${id}/comments`, payload);
  return res.data;
};

// Get a comment by id
export const getCommentById = async (id: string) => {
  const res = await apiRequest.get(`/comments/${id}`);
  return res.data;
};

// Reply to a comment
export const replyToComment = async (
  id: string,
  payload: { reply: string }
) => {
  const res = await apiRequest.post(`/comments/${id}/replies`, payload);
  return res.data;
};

// Like a comment
export const likeComment = async (id: string) => {
  const res = await apiRequest.post(`/comments/${id}/likes`);
  return res.data;
};
