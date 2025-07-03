"use client";

import { BellRing, MessageCircle, Users, Archive } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-manrope">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#42B883] flex items-center gap-2">
          <BellRing size={24} />
          Notifications
        </h1>
        <p className="text-muted-foreground mt-1">
          Stay updated on your ideas, labs, and interactions.
        </p>
      </div>

      <div className="space-y-4">
        {/* Example Placeholder Notifications */}
        <div className="rounded-xl border p-4 flex items-start gap-4 bg-white shadow-sm">
          <Users className="text-[#42B883]" size={20} />
          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-[#333]">@james_dev</span>{" "}
              showed interest in your Seedlet.
            </p>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
        </div>

        <div className="rounded-xl border p-4 flex items-start gap-4 bg-white shadow-sm">
          <MessageCircle className="text-[#42B883]" size={20} />
          <div>
            <p className="text-sm text-muted-foreground">
              New comment on your Lab{" "}
              <span className="font-medium text-[#333]">
                &quot;AI Resume Builder&quot;
              </span>
              .
            </p>
            <span className="text-xs text-gray-400">Yesterday</span>
          </div>
        </div>

        <div className="rounded-xl border p-4 flex items-start gap-4 bg-white shadow-sm">
          <Archive className="text-[#42B883]" size={20} />
          <div>
            <p className="text-sm text-muted-foreground">
              Your request to archive{" "}
              <span className="font-medium text-[#333]">
                &quot;Crypto Wallet UX Lab&quot;
              </span>{" "}
              was accepted.
            </p>
            <span className="text-xs text-gray-400">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
