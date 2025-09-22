"use client";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Rocket,
  ClipboardList,
  Globe,
  MapPin,
  User,
  //Loader2,
  PlusCircle,
} from "lucide-react";
import { logout } from "@/features/auth/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CurrentUserProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const user = data?.data;

  const socialLinks = user?.socialLinks || {};

  if (isLoading || !user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 font-manrope">
        <p className="text-center text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-10 font-manrope">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-start items-center gap-6">
        <div className="rounded-full w-[100px] h-[100px] relative">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="Profile picture"
            fill
            sizes="100px"
            className="rounded-full"
          />
        </div>
        <div className="text-center sm:mt-0 md:mt-3 sm:text-left space-y-1">
          <h1 className="text-3xl text-black font-bold flex items-center gap-2">
            @{user.username}
          </h1>
          <p className="text-muted-foreground text-lg">
            {user.title || "No title yet"}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      <Link href="/profile/edit">
        <Button
          variant="outline"
          className=" text-black flex items-center gap-2 cursor-pointer mb-4"
        >
          <Pencil size={16} /> Edit Profile
        </Button>
      </Link>

      <div className="space-y-2 text-sm text-muted-foreground">
        {/* Bio */}
        {user.bio && (
          <div className="flex items-center gap-2">
            <User size={14} className="shrink-0" />
            {user.bio}
          </div>
        )}
        {/* Country */}
        {user.country && (
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span>{user.country}</span>
          </div>
        )}
        {/* State */}
        {user.state && (
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{user.state}</span>
          </div>
        )}
        {/* Socials */}
        {socialLinks?.github && (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07a2.12 2.12 0 00-.88-1.16c-.72-.5.05-.49.05-.49a1.7 1.7 0 011.24.84 1.72 1.72 0 002.36.67c.03-.5.3-.85.54-1.05-1.78-.2-3.64-.89-3.64-3.95a3.09 3.09 0 01.82-2.14 2.87 2.87 0 01.08-2.11s.67-.21 2.2.82a7.59 7.59 0 014 0c1.52-1.03 2.2-.82 2.2-.82.43 1.1.16 1.91.08 2.11a3.09 3.09 0 01.82 2.14c0 3.07-1.87 3.75-3.65 3.95.31.27.58.81.58 1.63v2.42c0 .21.15.46.56.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <a
              href={socialLinks.github}
              target="_blank"
              className="hover:underline text-blue-600"
            >
              My GitHub
            </a>
          </div>
        )}

        {socialLinks?.linkedin && (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.49 8.09h3.99V24H.49V8.09zM8.98 8.09h3.83v2.18h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.09V24h-4.01v-7.09c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.85-2.72 3.75V24H8.98V8.09z" />
            </svg>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              className="hover:underline text-blue-600"
            >
              My LinkedIn
            </a>
          </div>
        )}
      </div>

      {/* Dummy Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seedlets */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#42B883]">
              Your Seedlets
            </CardTitle>
            <Rocket className="text-[#42B883]" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4F4F4F]">
              💡 Want to publish a Seedlet? The world’s waiting for your drop of
              brilliance.
            </p>
            <Button
              className="cursor-pointer mt-4 w-full"
              onClick={() => router.push("/seedlets/new")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Post a New Idea
            </Button>
          </CardContent>
        </Card>

        {/* Joined Labs */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#42B883]">
              Joined Labs
            </CardTitle>
            <ClipboardList className="text-[#42B883]" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4F4F4F]">
              ✨ Your Lab space is waiting. View your Labs or create a
              collaborative hub and bring others along for the ride.
            </p>
            <Button
              variant="outline"
              className="cursor-pointer mt-4 w-full"
              onClick={() => router.push("/labs")}
            >
              View Labs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Logout Section */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-[100px] mt-10 cursor-pointer"
          >
            Logout
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
            >
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
