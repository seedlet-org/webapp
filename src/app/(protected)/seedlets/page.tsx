"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sprout,
  MessageCircle,
  Heart,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  useIdeas,
  useLikeIdea,
  useShowInterest,
} from "@/features/ideas/hooks/useIdeas";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import { Tag, Seedlet } from "@/types/types";
import { useState } from "react";

export default function SeedletsPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  // Fetch ideas
  const { data: seedlets, isLoading } = useIdeas();
  const seedletList = seedlets?.data ?? [];

  // Mutations
  const likeMutation = useLikeIdea();
  const interestMutation = useShowInterest();

  // Local loader tracking
  const [likingSeedletId, setLikingSeedletId] = useState<string | null>(null);
  const [interestedSeedletId, setInterestedSeedletId] = useState<string | null>(
    null
  );

  // Role picker state
  const [rolePickerSeedletId, setRolePickerSeedletId] = useState<string | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 font-manrope">
        <p className="text-center text-gray-500">Loading seedlets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-manrope">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#42B883] flex items-center gap-2">
            <Sprout className="text-[#42B883]" size={28} />
            Explore Seedlets
          </h1>
          <p className="text-[#4F4F4F] mt-1">
            Discover promising ideas and join exciting projects.
          </p>
        </div>
        <Link href="/seedlets/new">
          <Button className="bg-[#42B883] hover:bg-[#36A273] text-white font-semibold px-5 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Plus size={18} />
            New Seedlet
          </Button>
        </Link>
      </div>

      {/* Seedlet cards */}
      <div className="grid md:grid-cols-2 gap-6 cursor-pointer">
        {seedletList?.map((seedlet: Seedlet) => {
          const isOwner =
            String(user?.data?.id) ===
            String(seedlet.ownerId ?? seedlet.owner?.id);

          return (
            <div
              key={seedlet.id}
              onClick={() => router.push(`/seedlets/${seedlet.id}`)}
              className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md transition group"
            >
              <div className="cursor-pointer">
                <h2 className="text-xl font-semibold text-[#333]">
                  {seedlet.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  {seedlet.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {seedlet.tags.map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="text-xs bg-[#C9F4E5] text-[#36A273] px-2 py-1 rounded-full"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>

              {/* Needed roles */}
              {seedlet.neededRoles?.length > 0 && (
                <p className="text-sm text-[#4F4F4F] mb-3">
                  <strong>Looking for:</strong> {seedlet.neededRoles.join(", ")}
                </p>
              )}

              {/* Card footer */}
              <div className="flex items-center justify-between text-sm text-[#4F4F4F]">
                <span>
                  <strong>By:</strong> @{seedlet.owner?.username}
                </span>
                <div className="flex items-center gap-4">
                  {/* Like */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLikingSeedletId(seedlet.id);
                      likeMutation.mutate(seedlet.id, {
                        onSettled: () => setLikingSeedletId(null),
                      });
                    }}
                    title="Like"
                    className="flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    disabled={likingSeedletId === seedlet.id}
                  >
                    {likingSeedletId === seedlet.id ? (
                      <Loader2
                        size={16}
                        className="text-[#FF6B6B] animate-spin"
                      />
                    ) : (
                      <Heart
                        size={16}
                        className={`${
                          seedlet.likedByCurrentUser
                            ? "fill-[#FF6B6B] text-[#FF6B6B]"
                            : "text-[#FF6B6B]"
                        }`}
                      />
                    )}
                    {seedlet.likeCount ?? 0}
                  </button>

                  {/* Comment */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/seedlets/${seedlet.id}?focus=comment`);
                    }}
                    title="Comment"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-[#42B883]" />
                    {seedlet.commentCount ?? 0}
                  </button>

                  {/* Interest */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isOwner) return;
                        setRolePickerSeedletId(
                          rolePickerSeedletId === seedlet.id ? null : seedlet.id
                        );
                      }}
                      disabled={isOwner || interestedSeedletId === seedlet.id}
                      title={
                        isOwner
                          ? "You cannot show interest in your own Seedlet"
                          : "I'm Interested"
                      }
                      className={`flex items-center gap-1 ${
                        isOwner
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-black cursor-pointer"
                      }`}
                    >
                      {interestedSeedletId === seedlet.id ? (
                        <Loader2
                          size={16}
                          className="text-[#6C5DD3] animate-spin"
                        />
                      ) : (
                        <UserPlus
                          size={16}
                          className={`${
                            seedlet.interestedByCurrentUser
                              ? "fill-[#6C5DD3] text-[#6C5DD3]"
                              : "text-[#6C5DD3]"
                          }`}
                        />
                      )}
                      {seedlet.interestCount ?? 0}
                    </button>

                    {/* Role Picker */}
                    {rolePickerSeedletId === seedlet.id && !isOwner && (
                      <div
                        className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md p-3 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm mb-2 text-gray-600">
                          Select a role
                        </p>
                        <div className="flex flex-col gap-2">
                          {(seedlet.neededRoles ?? []).map((role: string) => (
                            <button
                              key={role}
                              onClick={() => {
                                setInterestedSeedletId(seedlet.id);
                                interestMutation.mutate(
                                  {
                                    id: seedlet.id,
                                    roleInterestedIn: role,
                                  },
                                  {
                                    onSettled: () => {
                                      setInterestedSeedletId(null);
                                      setRolePickerSeedletId(null);
                                    },
                                  }
                                );
                              }}
                              className="px-3 py-1 rounded-md text-sm bg-[#F3F4F6]  hover:bg-[#42B883] hover:text-white transition text-left cursor-pointer"
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* If no seedlets */}
      {seedletList?.length === 0 && (
        <div className="border border-dashed border-[#C9F4E5] p-10 rounded-2xl text-center bg-[#F9FFFD] shadow-sm mt-10">
          <h2 className="text-xl font-semibold text-[#333] mb-2">
            No seedlets posted yet.
          </h2>
          <p className="text-muted-foreground mb-4">
            Seedlets are where ideas start. Be the first to share yours.
          </p>
          <Link href="/seedlets/new">
            <Button
              variant="outline"
              className="border-[#42B883] text-[#42B883] hover:bg-[#C9F4E5] cursor-pointer"
            >
              Post Your First Seedlet
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
