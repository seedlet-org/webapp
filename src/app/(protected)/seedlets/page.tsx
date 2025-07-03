"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Sprout,
  Users,
  MessageCircle,
  Heart,
  UserPlus,
} from "lucide-react";

export default function SeedletsPage() {
  const dummySeedlets = [
    {
      id: "1",
      title: "AI Study Buddy",
      description:
        "An AI-powered tool to help students learn faster and stay organized.",
      tags: ["AI", "EdTech"],
      author: "@janedev",
      interests: 4,
      likes: 12,
      comments: 3,
      lookingFor: ["Frontend Dev", "UX Designer"],
    },
    {
      id: "2",
      title: "FinTrackr",
      description:
        "A mobile app for managing and visualizing personal finances.",
      tags: ["Fintech", "Mobile"],
      author: "@mikesoft",
      interests: 6,
      likes: 8,
      comments: 1,
      lookingFor: ["Backend Dev"],
    },
  ];

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
      <div className="grid md:grid-cols-2 gap-6">
        {dummySeedlets.map((seedlet) => (
          <div
            key={seedlet.id}
            className="rounded-xl border shadow-sm p-6 bg-white hover:shadow-md transition"
          >
            <Link href={`/seedlets/${seedlet.id}`}>
              <h2 className="text-xl font-semibold text-[#333] hover:underline cursor-pointer">
                {seedlet.title}
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 mb-2">
              {seedlet.description}
            </p>

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
                <div className="flex items-center gap-1">
                  <Heart size={16} className="text-[#42B883] cursor-pointer" />
                  {seedlet.likes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle
                    size={16}
                    className="text-[#42B883] cursor-pointer"
                  />
                  {seedlet.comments}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-[#42B883] cursor-pointer" />
                  {seedlet.interests}
                </div>
              </div>
            </div>

            {/* Interest Button */}
            <Button
              variant="outline"
              className="mt-4 w-full flex items-center cursor-pointer justify-center gap-2 text-[#42B883] border-[#42B883] hover:bg-[#C9F4E5]"
            >
              <UserPlus size={16} />
              I’m Interested
            </Button>
          </div>
        ))}
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
