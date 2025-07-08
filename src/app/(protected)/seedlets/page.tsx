"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sprout, MessageCircle, Heart, UserPlus } from "lucide-react";
import {
  getInteractions,
  updateInteraction,
  Interaction,
} from "@/utils/postInteractions";
import { dummySeedlets } from "@/components/dummySeedlets";

export default function SeedletsPage() {
  const router = useRouter();
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    setInteractions(getInteractions());
  }, []);

  const toggleInteraction = (id: string, type: "liked" | "interested") => {
    setInteractions((prev) => {
      const updated = prev.map((i) =>
        i.id === id ? { ...i, [type]: !i[type] } : i
      );
      updateInteraction(id, {
        [type]: !prev.find((i) => i.id === id)?.[type],
      });
      return updated;
    });
  };

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

      {/* Seedlet Cards */}
      <div className="grid md:grid-cols-2 gap-6 cursor-pointer">
        {dummySeedlets.map((seedlet) => {
          const interaction = interactions.find((i) => i.id === seedlet.id) ?? {
            id: seedlet.id,
            liked: false,
            interested: false,
            comments: [],
          };

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
                {seedlet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[#C9F4E5] text-[#36A273] px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Looking for */}
              {seedlet.lookingFor.length > 0 && (
                <p className="text-sm text-[#4F4F4F] mb-3">
                  <strong>Looking for:</strong> {seedlet.lookingFor.join(", ")}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-[#4F4F4F]">
                <span>By {seedlet.author}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInteraction(seedlet.id, "liked");
                    }}
                    title="Like"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Heart
                      size={16}
                      className={`${
                        interaction.liked
                          ? "fill-[#FF6B6B] text-[#FF6B6B]"
                          : "text-[#FF6B6B]"
                      }`}
                    />
                    {seedlet.likes + (interaction.liked ? 1 : 0)}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/seedlets/${seedlet.id}?focus=comment`);
                    }}
                    title="Comment"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle size={16} className="text-[#42B883]" />
                    {interaction.comments.length}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleInteraction(seedlet.id, "interested");
                    }}
                    title="I'm Interested"
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus
                      size={16}
                      className={`${
                        interaction.interested
                          ? "fill-[#6C5DD3] text-[#6C5DD3]"
                          : "text-[#6C5DD3]"
                      }`}
                    />
                    {seedlet.interests + (interaction.interested ? 1 : 0)}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* If no seedlets */}
      {dummySeedlets.length === 0 && (
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
