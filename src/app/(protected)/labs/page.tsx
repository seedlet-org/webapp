"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, FlaskConical } from "lucide-react";

export default function LabsPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-6 font-manrope">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#42B883] flex items-center gap-2">
            <FlaskConical size={28} />
            Your Labs
          </h1>
          <p className="text-muted-foreground mt-1">
            Filter and manage your active, paused, or completed labs.
          </p>
        </div>

        <Button
          onClick={() => router.push("/labs/new")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle size={18} />
          Create Lab
        </Button>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground bg-muted/20">
        <p>No labs yet. Start collaborating with a team</p>
      </div>
    </div>
  );
}
