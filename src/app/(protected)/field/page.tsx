"use client";

import { useRouter } from "next/navigation";
import { Sparkles, GalleryVerticalEnd } from "lucide-react";

export default function FieldPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-manrope">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#42B883] flex items-center gap-2">
          <GalleryVerticalEnd size={24} />
          Field Showcase
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore completed Labs turned into real-world projects.
        </p>
      </div>

      <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
        No field entries yet.
        <p className="text-sm mt-2">
          Your completed Labs will appear here for the world to see ✨
        </p>
      </div>

      {/* (Optional) CTA: Promote a finished lab */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.push("/labs")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#42B883] hover:underline transition cursor-pointer"
        >
          <Sparkles size={16} />
          Got a completed Lab? Publish it to the Field!
        </button>
      </div>
    </div>
  );
}
