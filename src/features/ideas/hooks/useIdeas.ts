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
import {
  CreateSeedletPayload,
  FeedCache,
  DetailCache,
  Seedlet,
  Interest,
} from "@/types/types";
import { useCurrentUser } from "@/features/user/hooks/useUser";

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
      const maybeIdea = "data" in data ? data.data.idea : data;
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
  const { data: userResp } = useCurrentUser();
  const currentUserId = userResp?.data?.id;

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
        if (!old?.data || !currentUserId) return old;
        return {
          ...old,
          data: old.data.map((s) => {
            if (s.id !== id) return s;
            const alreadyInterested = !!s.currentUserHasInterest;

            let updatedInterests: Interest[];
            if (roleInterestedIn !== "") {
              // Update interest
              updatedInterests = [
                ...(s.interests ?? []).filter(
                  (i: Interest) => String(i.userId) !== String(currentUserId)
                ),
                { userId: currentUserId, roleInterestedIn },
              ];
            } else {
              // Remove interest
              updatedInterests = (s.interests ?? []).filter(
                (i: Interest) => String(i.userId) !== String(currentUserId)
              );
            }

            return {
              ...s,
              currentUserHasInterest: roleInterestedIn !== "",
              interestCount:
                roleInterestedIn !== "" && !alreadyInterested
                  ? (s.interestCount ?? 0) + 1
                  : roleInterestedIn === "" && alreadyInterested
                  ? Math.max(0, (s.interestCount ?? 0) - 1)
                  : s.interestCount,
              interests: updatedInterests,
            } as Seedlet;
          }),
        };
      });

      // Seedlet detail optimistic update
      queryClient.setQueryData<DetailCache>(["idea", id], (old) => {
        if (!old?.data?.idea || !currentUserId) return old;
        const idea = old.data.idea;
        const alreadyInterested = !!idea.currentUserHasInterest;

        let updatedInterests: Interest[];
        if (roleInterestedIn !== "") {
          updatedInterests = [
            ...(idea.interests ?? []).filter(
              (i: Interest) => String(i.userId) !== String(currentUserId)
            ),
            { userId: currentUserId, roleInterestedIn },
          ];
        } else {
          updatedInterests = (idea.interests ?? []).filter(
            (i: Interest) => String(i.userId) !== String(currentUserId)
          );
        }

        return {
          ...old,
          data: {
            ...old.data,
            idea: {
              ...idea,
              currentUserHasInterest: roleInterestedIn !== "",
              interestCount:
                roleInterestedIn !== "" && !alreadyInterested
                  ? (idea.interestCount ?? 0) + 1
                  : roleInterestedIn === "" && alreadyInterested
                  ? Math.max(0, (idea.interestCount ?? 0) - 1)
                  : idea.interestCount,
              interests: updatedInterests,
            } as Seedlet,
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

    // I've made it so SSE handles this
    onSuccess: () => {},
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
    mutationFn: async (commentId: string) => likeComment(commentId),

    onSuccess: (_data, commentId) => {
      queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      queryClient.invalidateQueries({ queryKey: ["comment", commentId] });
    },
  });
};
