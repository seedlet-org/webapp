import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  likeIdea,
  showInterestOnIdea,
  commentOnIdea,
  getCommentById,
  replyToComment,
  likeComment,
} from "../api";
import { CreateSeedletPayload } from "@/types/types";

// Queries
export const useIdeas = () => {
  return useQuery({
    queryKey: ["ideas"],
    queryFn: getIdeas,
  });
};

export const useIdeaById = (id: string) => {
  return useQuery({
    queryKey: ["idea", id],
    queryFn: () => getIdeaById(id),
    enabled: !!id,
  });
};

export const useCommentById = (id: string | null) => {
  return useQuery({
    queryKey: ["comment", id],
    queryFn: () => getCommentById(id!),
    enabled: !!id,
  });
};

// Mutations
export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSeedletPayload) => createIdea(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useUpdateIdea = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateSeedletPayload>) =>
      updateIdea(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useLikeIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return likeIdea(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useShowInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      roleInterestedIn,
    }: {
      id: string;
      roleInterestedIn: string;
    }) => {
      return showInterestOnIdea(id, { roleInterestedIn });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["idea", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useCommentOnIdea = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { comment: string }) => commentOnIdea(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
    },
  });
};

export const useReplyToComment = (ideaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, reply }: { commentId: string; reply: string }) =>
      replyToComment(commentId, { reply }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({
        queryKey: ["comment", variables.commentId],
      });
    },
  });
};

export const useLikeComment = (ideaId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetId }: { parentCommentId: string; targetId: string }) =>
      likeComment(targetId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({
        queryKey: ["comment", variables.parentCommentId],
      });
    },
  });
};
