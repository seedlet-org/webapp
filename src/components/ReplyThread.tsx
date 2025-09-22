"use client";

import React, { useState } from "react";
import {
  useCommentById,
  useLikeComment,
  useReplyToComment,
} from "@/features/ideas/hooks/useIdeas";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import { Heart, MessageCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { Reply } from "@/types/types";
import { ReplyThreadProps } from "@/types/types";

export default function ReplyThread({
  reply,
  ideaId,
  depth = 0,
}: ReplyThreadProps) {
  const { data: user } = useCurrentUser();
  const currentUserId = user?.data?.id;

  // Hooks
  const likeComment = useLikeComment(ideaId);
  const replyToComment = useReplyToComment(ideaId);

  // UI state
  const [isReplyBoxOpen, setIsReplyBoxOpen] = useState(false);
  const [localReplyContent, setLocalReplyContent] = useState("");
  const [activeNestedId, setActiveNestedId] = useState<string | null>(null);
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);

  // Fetch nested replies
  const { data: nestedData, isLoading: nestedLoading } =
    useCommentById(activeNestedId);

  // Owner check
  const replyOwnerId = reply.ownerId ?? reply.owner?.id;

  return (
    <div
      className={`bg-gray-50 border rounded-lg p-2 sm:p-3 ${
        depth > 0 ? "ml-4" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">
          @{reply.owner?.username || "Anon"}
        </span>

        {/* Edit/delete placeholders */}
        {String(currentUserId) === String(replyOwnerId) && (
          <div className="flex gap-2 text-gray-500">
            <button
              onClick={() => {
                // TODO: edit flow
              }}
              className="hover:text-[#42B883] cursor-pointer"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => {
                // TODO: delete flow
              }}
              className="hover:text-red-500 cursor-pointer"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <p className="text-gray-700 text-sm mt-1">{reply.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-2 text-xs text-[#4F4F4F]">
        <button
          onClick={() => {
            setLikingCommentId(reply.id);
            likeComment.mutate(reply.id, {
              onSettled: () => setLikingCommentId(null),
            });
          }}
          disabled={likingCommentId === reply.id && likeComment.isPending}
          className="flex items-center gap-1 hover:text-[#42B883] cursor-pointer disabled:opacity-50"
        >
          {likingCommentId === reply.id && likeComment.isPending ? (
            <span className="animate-spin w-3 h-3 border-2 border-[#42B883] border-t-transparent rounded-full"></span>
          ) : (
            <Heart
              size={12}
              className={
                reply.likedByCurrentUser
                  ? "fill-[#FF6B6B] text-[#FF6B6B]"
                  : "text-[#FF6B6B]"
              }
            />
          )}
          {reply.likeCount || 0}
        </button>

        {reply.commentCount > 0 && (
          <button
            onClick={() =>
              setActiveNestedId(activeNestedId === reply.id ? null : reply.id)
            }
            className="flex items-center gap-1 hover:text-[#42B883] cursor-pointer"
          >
            <MessageCircle size={12} />
            <span>
              {activeNestedId === reply.id
                ? "Hide Replies"
                : `View ${reply.commentCount} ${
                    reply.commentCount === 1 ? "Reply" : "Replies"
                  }`}
            </span>
          </button>
        )}

        <button
          onClick={() => {
            setIsReplyBoxOpen((s) => !s);
            setLocalReplyContent("");
          }}
          className="hover:text-[#42B883] cursor-pointer"
        >
          Reply
        </button>
      </div>

      {/* Reply box */}
      {isReplyBoxOpen && (
        <div className="mt-2 space-y-2">
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm text-black"
            placeholder="Write your reply..."
            value={localReplyContent}
            onChange={(e) => setLocalReplyContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!localReplyContent.trim()) return;
                replyToComment.mutate(
                  { commentId: reply.id, reply: localReplyContent.trim() },
                  {
                    onSuccess: () => {
                      setIsReplyBoxOpen(false);
                      setLocalReplyContent("");
                      setActiveNestedId(reply.id);
                    },
                  }
                );
              }}
              disabled={replyToComment.isPending}
              className="px-3 py-1 bg-[#42B883] text-white rounded-md text-sm flex items-center gap-2 justify-center cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {replyToComment.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Replying...
                </>
              ) : (
                "Reply"
              )}
            </button>

            <button
              onClick={() => setIsReplyBoxOpen(false)}
              className="px-3 py-1 bg-gray-200 text-sm rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested replies listing */}
      {activeNestedId === reply.id && (
        <div className="mt-3">
          {nestedLoading ? (
            <div className="text-sm text-gray-500">
              <Loader2 size={14} className="animate-spin" />
            </div>
          ) : (
            [...(nestedData?.data?.replies ?? [])]
              .sort(
                (a: Reply, b: Reply) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((nestedReply: Reply) => (
                <ReplyThread
                  key={nestedReply.id}
                  reply={nestedReply}
                  ideaId={ideaId}
                  parentId={reply.id}
                  depth={depth + 1}
                />
              ))
          )}
        </div>
      )}
    </div>
  );
}
