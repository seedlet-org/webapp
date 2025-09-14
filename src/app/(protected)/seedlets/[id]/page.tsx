"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  useIdeaById,
  useLikeIdea,
  useShowInterest,
  useCommentOnIdea,
  useLikeComment,
  useReplyToComment,
  useCommentById,
} from "@/features/ideas/hooks/useIdeas";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import {
  Heart,
  MessageCircle,
  UserPlus,
  ArrowLeft,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReplyThread from "@/components/ReplyThread";
import { Idea, Comment, Reply, Tag } from "@/types/types";
import RolePicker from "@/components/RolePicker";
import { useSeedletEvents } from "@/features/ideas/hooks/useSeedletEvents";

export default function SeedletDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusComment = searchParams.get("focus") === "comment";
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { data: user } = useCurrentUser();

  // Fetch idea
  const { data: ideaData, isLoading } = useIdeaById(id as string);

  // Listen to real-time events
  useSeedletEvents();

  // Mutations
  const likeIdea = useLikeIdea();
  const showInterest = useShowInterest();
  const commentOnIdea = useCommentOnIdea(id as string);
  const likeComment = useLikeComment(id as string);
  const replyToComment = useReplyToComment(id as string);

  const [newComment, setNewComment] = useState("");

  // UI states
  const [interestOpen, setInterestOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null);
  const { data: activeCommentData, isLoading: activeCommentLoading } =
    useCommentById(activeCommentId);

  // Comment focus
  useEffect(() => {
    if (focusComment && commentRef.current) {
      commentRef.current.focus();
    }
  }, [focusComment]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!ideaData?.data?.idea) {
    return (
      <div className="p-10 text-center text-gray-500">Seedlet not found.</div>
    );
  }

  const seedlet: Idea = ideaData.data.idea;
  const userInterest = seedlet.interests?.find(
    (i) => String(i.userId) === String(user?.data?.id)
  );

  // Sort top-level comments newest-first
  const comments: Comment[] =
    ideaData.data.comments
      ?.filter((c: Comment) => !c.parentId)
      ?.sort(
        (a: Comment, b: Comment) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    await commentOnIdea.mutateAsync({ comment: newComment.trim() });
    setNewComment("");
  };

  // const handleInterest = (role: string) => {
  //   showInterest.mutate({ id: id as string, roleInterestedIn: role });
  //   setInterestOpen(false);
  // };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-manrope">
      <button
        onClick={() => router.push("/seedlets")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-black cursor-pointer hover:underline transition"
      >
        <ArrowLeft size={16} />
        Back to Seedlets
      </button>

      <Card>
        <CardHeader className="relative">
          {String(user?.data?.id) ===
            String(seedlet.ownerId ?? seedlet.owner?.id) && (
            <button
              onClick={() => router.push(`/seedlets/${seedlet.id}/edit`)}
              className="absolute top-0 right-6 flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#42B883] text-white text-xs font-medium shadow-sm hover:bg-[#36A273] transition cursor-pointer"
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#42B883]">{seedlet.title}</h1>
          <p className="text-muted-foreground">{seedlet.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {seedlet.tags?.map((tag: Tag) => (
              <span
                key={tag.id}
                className="text-xs bg-[#C9F4E5] text-[#36A273] px-2 py-1 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* Owner */}
          <p className="text-sm text-gray-700">
            <strong>By:</strong> @{seedlet.owner?.username || "Anon"}
          </p>

          {seedlet.neededRoles?.length > 0 && (
            <p className="text-sm text-[#4F4F4F]">
              <strong>Looking for:</strong> {seedlet.neededRoles.join(", ")}
            </p>
          )}

          {/* Interaction bar */}
          <div className="flex items-center gap-6 text-sm text-[#4F4F4F] relative">
            <button
              onClick={() => likeIdea.mutate(id as string)}
              disabled={likeIdea.isPending}
              className="flex items-center gap-1 cursor-pointer"
              title="Like"
            >
              {likeIdea.isPending ? (
                <span className="animate-spin w-4 h-4 border-2 border-[#FF6B6B] border-t-transparent rounded-full"></span>
              ) : (
                <Heart
                  size={18}
                  className="text-[#FF6B6B]"
                  fill={seedlet.likedByCurrentUser ? "#FF6B6B" : "none"}
                />
              )}
              {seedlet.likeCount}
            </button>

            <div className="flex items-center gap-1 cursor-pointer">
              <MessageCircle size={18} className="text-[#42B883]" />
              {seedlet.commentCount}
            </div>

            <button
              onClick={() => {
                if (
                  String(user?.data?.id) ===
                  String(seedlet.ownerId ?? seedlet.owner?.id)
                )
                  return;
                setInterestOpen((prev) => !prev);
              }}
              className={`flex items-center gap-1 ${
                String(user?.data?.id) ===
                String(seedlet.ownerId ?? seedlet.owner?.id)
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black cursor-pointer"
              }`}
              title={
                String(user?.data?.id) ===
                String(seedlet.ownerId ?? seedlet.owner?.id)
                  ? "You cannot show interest in your own Seedlet"
                  : "I'm Interested"
              }
            >
              <UserPlus
                size={18}
                className={`${
                  seedlet.currentUserHasInterest
                    ? "fill-[#6C5DD3] text-[#6C5DD3]"
                    : "text-[#6C5DD3]"
                }`}
              />

              {seedlet.interestCount}
            </button>

            {/* Role picker */}
            {interestOpen && (
              <RolePicker
                seedlet={seedlet}
                userId={user?.data?.id}
                isOwner={String(user?.data?.id) === String(seedlet.ownerId)}
                isLoading={showInterest.isPending}
                selectedRole={userInterest?.roleInterestedIn}
                onSelectRole={(role) =>
                  showInterest.mutate({
                    id: id as string,
                    roleInterestedIn: role,
                  })
                }
                onClose={() => setInterestOpen(false)}
              />
            )}
          </div>

          {/* Comment section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-black mb-2">
              Leave a comment
            </h2>
            <textarea
              ref={commentRef}
              rows={1}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#42B883] placeholder:text-muted-foreground text-black"
              placeholder="Write your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!newComment.trim() || commentOnIdea.isPending}
              className={`mt-3 px-4 py-2 rounded-md flex items-center gap-2 justify-center text-white transition cursor-pointer ${
                !newComment.trim() || commentOnIdea.isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#42B883] hover:bg-[#36A273]"
              }`}
            >
              {commentOnIdea.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Comment"
              )}
            </button>

            {comments.length === 0 ? (
              <div className="mt-6 text-center text-gray-500 bg-gray-50 border rounded-lg p-6 shadow-sm">
                <p className="text-sm">
                  No comments yet. Be the first to start the conversation
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {comments.map((comment: Comment) => {
                  const currentUserId = user?.data?.id;
                  const commentOwnerId = comment.ownerId ?? comment.owner?.id;

                  return (
                    <div
                      key={comment.id}
                      className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm"
                    >
                      {/* Comment Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-black">
                          @{comment.owner?.username || "Anon"}
                        </span>

                        {String(currentUserId) === String(commentOwnerId) && (
                          <div className="flex gap-2 text-gray-500">
                            <button
                              onClick={() => {
                                setEditingComment(comment.id);
                                setEditContent(comment.content);
                              }}
                              className="hover:text-[#42B883] cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => {
                                // TODO: add delete mutation when endpoint is ready
                              }}
                              className="hover:text-red-500 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment body */}
                      {editingComment === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-black"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                // TODO: add edit mutation also
                                setEditingComment(null);
                                setEditContent("");
                              }}
                              className="px-3 py-1 bg-[#42B883] text-white rounded-md text-sm cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingComment(null)}
                              className="px-3 py-1 bg-gray-200 text-sm rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 mb-3 text-sm sm:text-base">
                          {comment.content}
                        </p>
                      )}

                      {/* Comment actions */}
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-[#4F4F4F]">
                        <button
                          onClick={() => {
                            setLikingCommentId(comment.id);
                            likeComment.mutate(
                              {
                                parentCommentId: comment.id,
                                targetId: comment.id,
                              },
                              { onSettled: () => setLikingCommentId(null) }
                            );
                          }}
                          disabled={
                            likingCommentId === comment.id &&
                            likeComment.isPending
                          }
                          className="flex items-center gap-1 hover:text-[#42B883] cursor-pointer disabled:opacity-50"
                        >
                          {likingCommentId === comment.id &&
                          likeComment.isPending ? (
                            <span className="animate-spin w-3 h-3 border-2 border-[#42B883] border-t-transparent rounded-full"></span>
                          ) : (
                            <Heart
                              size={14}
                              className={
                                comment.likedByCurrentUser
                                  ? "fill-[#FF6B6B] text-[#FF6B6B]"
                                  : "text-[#FF6B6B]"
                              }
                            />
                          )}
                          {comment.likeCount || 0}
                        </button>

                        {comment.commentCount > 0 && (
                          <button
                            onClick={() =>
                              setActiveCommentId(
                                activeCommentId === comment.id
                                  ? null
                                  : comment.id
                              )
                            }
                            className="flex items-center gap-1 hover:text-[#42B883] cursor-pointer"
                          >
                            <MessageCircle size={14} />
                            {activeCommentId === comment.id ? (
                              activeCommentLoading ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />{" "}
                                </>
                              ) : (
                                "Hide Replies"
                              )
                            ) : (
                              `View ${comment.commentCount} ${
                                comment.commentCount === 1 ? "Reply" : "Replies"
                              }`
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setReplyingTo(comment.id);
                            setReplyContent("");
                          }}
                          className="hover:text-[#42B883] cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply box for top-level comment */}
                      {replyingTo === comment.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-sm text-black"
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (!replyContent.trim()) return;
                                replyToComment.mutate(
                                  {
                                    commentId: comment.id,
                                    reply: replyContent.trim(),
                                  },
                                  {
                                    onSuccess: () => {
                                      setReplyingTo(null);
                                      setReplyContent("");
                                      setActiveCommentId(comment.id);
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
                              onClick={() => setReplyingTo(null)}
                              className="px-3 py-1 bg-gray-200 text-sm rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Replies fom ReplyThread */}
                      {activeCommentId === comment.id &&
                        activeCommentData?.data?.replies?.length > 0 && (
                          <div className="ml-4 mt-3 space-y-3 border-l pl-3">
                            {activeCommentData.data.replies.map(
                              (reply: Reply) => (
                                <ReplyThread
                                  key={reply.id}
                                  reply={reply}
                                  ideaId={id as string}
                                  parentId={comment.id}
                                />
                              )
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
