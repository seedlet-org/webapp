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
import { Comment, CreateSeedletPayload } from "@/types/types";
import { FeedCache, DetailCache, CommentCache } from "@/types/types";

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
      //Safety fallback just in case
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
    mutationFn: async (id: string) => likeIdea(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["ideas"] });
      await queryClient.cancelQueries({ queryKey: ["idea", id] });

      const previousIdeas = queryClient.getQueryData<FeedCache>(["ideas"]);
      const previousIdea = queryClient.getQueryData<DetailCache>(["idea", id]);

      // Seedlet feed optimistic update
      queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s) => {
            if (s.id !== id) return s;
            const currentlyLiked = !!s.likedByCurrentUser;
            return {
              ...s,
              likedByCurrentUser: !currentlyLiked,
              likeCount: Math.max(
                0,
                (s.likeCount ?? 0) + (currentlyLiked ? -1 : 1)
              ),
            };
          }),
        };
      });

      // Seedlet detail otimistic update
      queryClient.setQueryData<DetailCache>(["idea", id], (old) => {
        if (!old?.data?.idea) return old;
        const idea = old.data.idea;
        const currentlyLiked = idea.likedByCurrentUser ?? false;
        return {
          ...old,
          data: {
            ...old.data,
            idea: {
              ...idea,
              likedByCurrentUser: !currentlyLiked,
              likeCount: Math.max(
                0,
                (idea.likeCount ?? 0) + (currentlyLiked ? -1 : 1)
              ),
            },
          },
        };
      });

      return { previousIdeas, previousIdea };
    },

    onError: (_err, id, context) => {
      if (context?.previousIdeas)
        queryClient.setQueryData(["ideas"], context.previousIdeas);
      if (context?.previousIdea)
        queryClient.setQueryData(["idea", id], context.previousIdea);
    },

    onSuccess: (data, id) => {
      const maybeIdea =
        (data as any)?.data?.idea ?? (data as any)?.idea ?? (data as any);
      if (!maybeIdea || !maybeIdea.id) return;

      const normalized = {
        ...maybeIdea,
        likedByCurrentUser: !!maybeIdea.likedByCurrentUser,
      };

      // Update seedlet feed
      queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s) =>
            s.id === normalized.id ? { ...s, ...normalized } : s
          ),
        };
      });

      // Update seedlet detail
      queryClient.setQueryData<DetailCache>(["idea", id], (old) => {
        if (!old?.data?.idea) return old;
        return {
          ...old,
          data: { ...old.data, idea: { ...old.data.idea, ...normalized } },
        };
      });
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
    }) => showInterestOnIdea(id, { roleInterestedIn }),

    onMutate: async ({ id, roleInterestedIn }) => {
      await queryClient.cancelQueries({ queryKey: ["ideas"] });
      await queryClient.cancelQueries({ queryKey: ["idea", id] });

      const previousIdeas = queryClient.getQueryData<FeedCache>(["ideas"]);
      const previousIdea = queryClient.getQueryData<DetailCache>(["idea", id]);

      // Seedlet feed optimistic update
      queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s) => {
            if (s.id !== id) return s;
            const currently = !!s.currentUserHasInterest;
            return {
              ...s,
              currentUserHasInterest: !currently,
              interestCount: Math.max(
                0,
                (s.interestCount ?? 0) + (currently ? -1 : 1)
              ),
            };
          }),
        };
      });

      // Seedlet detail optimistic update
      queryClient.setQueryData<DetailCache>(["idea", id], (old) => {
        if (!old?.data?.idea) return old;
        const idea = old.data.idea;
        const currently = idea.currentUserHasInterest ?? false;
        return {
          ...old,
          data: {
            ...old.data,
            idea: {
              ...idea,
              currentUserHasInterest: !currently,
              interestCount: Math.max(
                0,
                (idea.interestCount ?? 0) + (currently ? -1 : 1)
              ),
              roleInterestedIn: !currently ? roleInterestedIn : null,
            },
          },
        };
      });

      return { previousIdeas, previousIdea };
    },

    onError: (_err, vars, ctx) => {
      if (ctx?.previousIdeas)
        queryClient.setQueryData(["ideas"], ctx.previousIdeas);
      if (ctx?.previousIdea)
        queryClient.setQueryData(["idea", vars.id], ctx.previousIdea);
    },

    onSuccess: (data, variables) => {
      const maybeIdea =
        (data as any)?.data?.idea ?? (data as any)?.idea ?? (data as any);
      if (!maybeIdea || !maybeIdea.id) return;

      const normalized = {
        ...maybeIdea,
        currentUserHasInterest: !!maybeIdea.currentUserHasInterest,
      };

      // Update seedlet feed
      queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((s) =>
            s.id === normalized.id ? { ...s, ...normalized } : s
          ),
        };
      });

      // Update seedlet detail
      queryClient.setQueryData<DetailCache>(["idea", variables.id], (old) => {
        if (!old?.data?.idea) return old;
        return {
          ...old,
          data: { ...old.data, idea: { ...old.data.idea, ...normalized } },
        };
      });
    },
  });
};

export const useCommentOnIdea = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { comment: string }) => commentOnIdea(id, payload),
    onSuccess: () => {
      // Safety fallback just in case
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
      queryClient.invalidateQueries({
        queryKey: ["comment", variables.commentId],
      });
    },
  });
};

export const useLikeComment = (ideaId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      parentCommentId,
      targetId,
    }: {
      parentCommentId: string;
      targetId: string;
    }) => likeComment(targetId),

    onMutate: async ({ parentCommentId, targetId }) => {
      await queryClient.cancelQueries({ queryKey: ["idea", ideaId] });
      await queryClient.cancelQueries({
        queryKey: ["comment", parentCommentId],
      });

      const previousIdea = queryClient.getQueryData<DetailCache>([
        "idea",
        ideaId,
      ]);
      const previousComment = queryClient.getQueryData<CommentCache>([
        "comment",
        parentCommentId,
      ]);

      // Update seedlet detail page comments
      if (previousIdea) {
        queryClient.setQueryData(["idea", ideaId], {
          ...previousIdea,
          comments: previousIdea.comments?.map((comment: Comment) => {
            comment.id === targetId
              ? {
                  ...comment,
                  likedByCurrentUser: !comment.likedByCurrentUser,
                  likeCount: comment.likedByCurrentUser
                    ? comment.likeCount - 1
                    : comment.likeCount + 1,
                }
              : comment;
          }),
        });
      }
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({
        queryKey: ["comment", variables.parentCommentId],
      });
    },
  });
};
