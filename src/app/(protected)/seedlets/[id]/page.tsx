"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getInteractionById,
  updateInteraction,
  Interaction,
  CommentData,
} from "@/utils/postInteractions";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import {
  Heart,
  MessageCircle,
  UserPlus,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { dummySeedlets } from "@/components/dummySeedlets";

export default function SeedletDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusComment = searchParams.get("focus") === "comment";
  const seedlet = dummySeedlets.find((s) => s.id === id);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { data: user } = useCurrentUser();

  const [interaction, setInteraction] = useState<Interaction>(() =>
    getInteractionById(id as string)
  );

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentData[]>(
    (interaction.comments as unknown as CommentData[]) || []
  );

  useEffect(() => {
    if (focusComment && commentRef.current) {
      commentRef.current.focus();
    }
  }, [focusComment]);

  useEffect(() => {
    updateInteraction(id as string, { ...interaction, comments });
  }, [interaction, comments, id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const username = user?.data?.username;

    const newEntry: CommentData = {
      id: crypto.randomUUID(),
      content: newComment.trim(),
      author: username,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    const updatedComments = [newEntry, ...comments];
    setComments(updatedComments);

    const updatedInteraction: Interaction = {
      ...interaction,
      comments: updatedComments,
    };

    setInteraction(updatedInteraction);
    updateInteraction(id as string, updatedInteraction);
    setNewComment("");
  };

  const toggleCommentLike = (commentId: string) => {
    const likedIds = interaction.likedCommentIds || [];
    const hasLiked = likedIds.includes(commentId);

    const updatedComments = comments.map((c) =>
      c.id === commentId
        ? { ...c, likes: hasLiked ? c.likes - 1 : c.likes + 1 }
        : c
    );

    const updatedLikedIds = hasLiked
      ? likedIds.filter((id) => id !== commentId)
      : [...likedIds, commentId];

    const updatedInteraction: Interaction = {
      ...interaction,
      comments: updatedComments,
      likedCommentIds: updatedLikedIds,
    };

    setComments(updatedComments);
    setInteraction(updatedInteraction);
    updateInteraction(id as string, updatedInteraction);
  };

  const handleDeleteComment = (commentId: string) => {
    const updatedComments = comments.filter((c) => c.id !== commentId);
    const updatedLikedIds = (interaction.likedCommentIds || []).filter(
      (id) => id !== commentId
    );

    const updatedInteraction: Interaction = {
      ...interaction,
      comments: updatedComments,
      likedCommentIds: updatedLikedIds,
    };

    setComments(updatedComments);
    setInteraction(updatedInteraction);
    updateInteraction(id as string, updatedInteraction);
  };

  if (!seedlet) {
    return (
      <div className="p-10 text-center text-gray-500">Seedlet not found.</div>
    );
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " · " +
      date.toLocaleDateString()
    );
  };

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
        <CardHeader>
          <h1 className="text-2xl font-bold text-[#42B883]">{seedlet.title}</h1>
          <p className="text-muted-foreground">{seedlet.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {seedlet.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#C9F4E5] text-[#36A273] px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-700">
            <strong>Posted by:</strong> {seedlet.author}
          </p>

          {seedlet.lookingFor.length > 0 && (
            <p className="text-sm text-[#4F4F4F]">
              <strong>Looking for:</strong> {seedlet.lookingFor.join(", ")}
            </p>
          )}

          {/* Interaction Bar */}
          <div className="flex items-center gap-6 text-sm text-[#4F4F4F]">
            <button
              onClick={() =>
                setInteraction((prev) => ({ ...prev, liked: !prev.liked }))
              }
              className="flex items-center gap-1 cursor-pointer"
              title="Like"
            >
              <Heart
                size={18}
                className={`${
                  interaction.liked
                    ? "fill-[#FF6B6B] text-[#FF6B6B]"
                    : "text-[#FF6B6B]"
                }`}
              />
              {seedlet.likes + (interaction.liked ? 1 : 0)}
            </button>

            <div className="flex items-center gap-1 cursor-pointer">
              <MessageCircle size={18} className="text-[#42B883]" />
              {seedlet.comments + comments.length}
            </div>

            <button
              onClick={() =>
                setInteraction((prev) => ({
                  ...prev,
                  interested: !prev.interested,
                }))
              }
              className="flex items-center gap-1 cursor-pointer"
              title="I'm Interested"
            >
              <UserPlus
                size={18}
                className={`${
                  interaction.interested
                    ? "fill-[#6C5DD3] text-[#6C5DD3]"
                    : "text-[#6C5DD3]"
                }`}
              />
              {seedlet.interests + (interaction.interested ? 1 : 0)}
            </button>
          </div>

          {/* Comment Section */}
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
              disabled={!newComment.trim() || !user?.data?.username}
              className={`mt-3 px-4 py-2 rounded-md cursor-pointer text-white transition ${
                !newComment.trim() || !user?.data?.username
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#42B883] hover:bg-[#36A273]"
              }`}
            >
              Post Comment
            </button>

            {comments.length === 0 ? (
              <div className="mt-6 text-center text-gray-500 bg-gray-50 border rounded-lg p-6 shadow-sm">
                <p className="text-sm">
                  No comments yet. Be the first to start the conversation
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-black">
                          @{comment.author}
                        </span>{" "}
                        • {formatTime(comment.timestamp)}
                      </div>
                    </div>
                    <p className="text-gray-800 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm text-[#4F4F4F]">
                      <button
                        onClick={() => toggleCommentLike(comment.id)}
                        className="flex items-center gap-1 hover:text-[#42B883] transition cursor-pointer"
                      >
                        <Heart
                          size={16}
                          className={
                            (interaction.likedCommentIds || []).includes(
                              comment.id
                            )
                              ? "fill-[#FF6B6B] text-[#FF6B6B]"
                              : "text-[#FF6B6B]"
                          }
                        />
                        {comment.likes}
                      </button>

                      {user?.data?.username === comment.author && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 transition"
                          title="Delete Comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
