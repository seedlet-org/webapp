import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CommentReply,
  Seedlet,
  SSEMessage,
  FeedCache,
  DetailCache,
  CommentCache,
} from "@/types/types";

/**
 * Type guard: check if SSE data is a Like event
 */
function isLikeEvent(
  data: SSEMessage
): data is { ref: "idea"; refId: string; liked: boolean } {
  return "liked" in data;
}

/**
 * Type guard: check if SSE data is a Comment event
 */
function isCommentEvent(
  data: SSEMessage
): data is { ref: "idea"; refId: string; reply: CommentReply } {
  return "reply" in data;
}

/**
 * Type guard: check if SSE data is an Interest event
 */
function isInterestEvent(
  data: SSEMessage
): data is { ref: "idea"; refId: string; interested: number } {
  return "interested" in data;
}

/**
 * Type guard: check if SSE data is a Create event
 */
function isCreateEvent(
  data: SSEMessage
): data is { ref: "idea"; created: Seedlet } {
  return "created" in data;
}

/**
 * Hook: subscribes to SSE and updates react-query caches
 * - Keeps feed + detail pages in sync with live events
 * - Handles like, comment, interest, and create events
 */
export function useSeedletEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let retryDelay = 1000;
    let eventSource: EventSource | null = null;

    // Apply incoming SSE message to caches

    const updateCaches = (data: SSEMessage) => {
      // Handle new idea creation
      if (isCreateEvent(data)) {
        queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
          if (!old?.data) return old;
          if (old.data.some((s) => s.id === data.created.id)) return old;
          return { ...old, data: [data.created, ...old.data] };
        });
        return;
      }

      const refId = (data as any).refId as string;

      // Check if incoming comment already exists in cache
      const prevComments = queryClient.getQueryData<CommentCache>([
        "ideaComments",
        refId,
      ]);
      const reply = isCommentEvent(data) ? data.reply : undefined;
      const replyAlreadyPresent =
        !!reply &&
        !!prevComments?.data?.comments?.some((c) => c.id === reply.id);

      // Update comment cache
      if (isCommentEvent(data)) {
        queryClient.setQueryData<CommentCache>(
          ["ideaComments", refId],
          (old) => {
            if (!old?.data?.comments) return old;
            if (replyAlreadyPresent) return old;
            return {
              ...old,
              data: {
                ...old.data,
                comments: [data.reply, ...old.data.comments],
              },
            };
          }
        );
      }

      // Update seedlet detail cache
      queryClient.setQueryData<DetailCache>(["idea", refId], (old) => {
        if (!old?.data?.idea) return old;
        const idea = old.data.idea;
        const updated: Seedlet = { ...idea };

        if (isLikeEvent(data)) {
          const currentlyLiked = idea.likedByCurrentUser ?? false;
          updated.likedByCurrentUser = data.liked;
          if (currentlyLiked !== data.liked) {
            updated.likeCount = Math.max(
              0,
              (idea.likeCount ?? 0) + (data.liked ? 1 : -1)
            );
          }
        }

        if (isCommentEvent(data)) {
          if (!replyAlreadyPresent) {
            updated.commentCount = (idea.commentCount ?? 0) + 1;
          } else {
            updated.commentCount = idea.commentCount ?? 0;
          }
        }

        if (isInterestEvent(data)) {
          updated.interestCount = data.interested;
        }

        return { ...old, data: { ...old.data, idea: updated } };
      });

      // Update seedlet feed cache
      queryClient.setQueryData<FeedCache>(["ideas"], (old) => {
        if (!old?.data) return old;
        const newData = old.data.map((s) => {
          if (s.id !== refId) return s;
          const item = { ...s };

          if (isLikeEvent(data)) {
            const currentlyLiked = s.likedByCurrentUser ?? false;
            item.likedByCurrentUser = data.liked;
            if (currentlyLiked !== data.liked) {
              item.likeCount = Math.max(
                0,
                (s.likeCount ?? 0) + (data.liked ? 1 : -1)
              );
            }
          }

          if (isCommentEvent(data)) {
            if (!replyAlreadyPresent) {
              item.commentCount = (s.commentCount ?? 0) + 1;
            } else {
              item.commentCount = s.commentCount ?? 0;
            }
          }

          if (isInterestEvent(data)) {
            item.interestCount = data.interested;
          }

          return item;
        });
        return { ...old, data: newData };
      });
    };

    // Open SSE connection and listen to events
    const connect = () => {
      eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_BASE_URL}/events`,
        { withCredentials: true }
      );

      eventSource.onopen = () => {
        console.log("SSE connected");
        retryDelay = 1000;
      };

      eventSource.addEventListener("like", (ev) => {
        try {
          const data: SSEMessage = JSON.parse((ev as MessageEvent).data);
          console.log("SSE like:", data);
          updateCaches(data);
        } catch (err) {
          console.error("SSE parse error (like):", err);
        }
      });

      eventSource.addEventListener("comment", (ev) => {
        try {
          const data: SSEMessage = JSON.parse((ev as MessageEvent).data);
          console.log("SSE comment:", data);
          updateCaches(data);
        } catch (err) {
          console.error("SSE parse error (comment):", err);
        }
      });

      eventSource.addEventListener("interest", (ev) => {
        try {
          const data: SSEMessage = JSON.parse((ev as MessageEvent).data);
          console.log("SSE interest:", data);
          updateCaches(data);
        } catch (err) {
          console.error("SSE parse error (interest):", err);
        }
      });

      eventSource.addEventListener("create", (ev) => {
        try {
          const data: SSEMessage = JSON.parse((ev as MessageEvent).data);
          console.log("SSE create:", data);
          updateCaches(data);
        } catch (err) {
          console.error("SSE parse error (create):", err);
        }
      });

      eventSource.onerror = () => {
        console.error("SSE disconnected. Retrying...");
        eventSource?.close();
        setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      console.log("SSE closed");
    };
  }, [queryClient]);
}
