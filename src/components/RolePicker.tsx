"use client";

import { useRef } from "react";
import { Loader2 } from "lucide-react";
import useClickOutside from "@/features/ideas/hooks/useClickOutside";
import { RolePickerProps } from "@/types/types";

export default function RolePicker({
  seedlet,
  userId,
  isOwner,
  isLoading,
  onSelectRole,
  onClose,
}: RolePickerProps) {
  const rolePickerRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(rolePickerRef, onClose);

  if (isOwner) return null;

  const userInterest = seedlet.interests?.find((i) => i.userId === userId);

  return (
    <div
      ref={rolePickerRef}
      className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md p-3 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-sm mb-2 text-gray-600">Select a role</p>
      <div className="flex flex-col gap-2">
        {(seedlet.neededRoles ?? []).map((role) => {
          const isActive = userInterest?.roleInterestedIn === role;

          return (
            <button
              key={role}
              onClick={() => onSelectRole(role)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-md text-sm transition text-left cursor-pointer 
                ${
                  isActive
                    ? "bg-[#42B883] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                role
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
