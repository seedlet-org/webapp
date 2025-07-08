"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/features/user/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, BadgeInfo, Globe, MapPin, User, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  image_url: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().max(200, "Bio must not exceed 200 characters").optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  socialLinks: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
});

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [bioValue, setBioValue] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "image/png") {
        toast.error("Only PNG images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const formData = new FormData();

      const fileInput = document.getElementById(
        "imageUpload"
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        formData.append("image", file);
      }

      if (data.title) formData.append("title", data.title);
      if (data.bio) formData.append("bio", data.bio);
      if (data.country) formData.append("country", data.country);
      if (data.state) formData.append("state", data.state);
      if (data.socialLinks)
        formData.append("socialLinks", JSON.stringify(data.socialLinks));

      const userId = currentUser.data.id;

      const updatedUser = await updateProfile(userId, formData);
      queryClient.setQueryData(["currentUser"], {
        data: {
          ...currentUser.data,
          ...updatedUser,
          image: updatedUser.image || currentUser.data.image,
        },
      });

      toast.success("Profile updated!");
      router.push(`/profile`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.data) return;

    const user = currentUser.data;

    setValue("title", user.title || "");
    setValue("bio", user.bio || "");
    setBioValue(user.bio || "");
    setValue("country", user.country || "");
    setValue("state", user.state || "");
    setValue("socialLinks.github", user.socialLinks?.github || "");
    setValue("socialLinks.linkedin", user.socialLinks?.linkedin || "");

    if (user.image) setPreviewImage(user.image);
  }, [currentUser, setValue]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Edit Your Profile</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer group flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-muted shadow-md hover:opacity-80 transition-all">
                  <Image
                    src={previewImage || "/default-avatar.png"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  accept="image/png"
                  id="imageUpload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground group-hover:underline">
                  <Pencil size={14} />
                  <span>Change Profile Picture</span>
                </div>
              </label>
            </div>

            {/* Title */}
            <div className="relative">
              <BadgeInfo
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                {...register("title")}
                placeholder="Title (e.g. Developer)"
                className="pl-10"
              />
              {errors.title?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="relative">
              <User
                className="absolute left-3 top-4 text-muted-foreground"
                size={16}
              />
              <div>
                <Textarea
                  {...register("bio")}
                  value={bioValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 200) setBioValue(value);
                  }}
                  placeholder="Tell us about yourself..."
                  className="pl-10 pt-3"
                />
                <div
                  className={`text-right text-xs mt-1 ${
                    bioValue.length >= 200
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {bioValue.length}/200 characters
                </div>
                {errors.bio?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="relative">
              <Globe
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                {...register("country")}
                placeholder="Country"
                className="pl-10"
              />
              {errors.country?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                {...register("state")}
                placeholder="State"
                className="pl-10"
              />
              {errors.state?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* GitHub */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.34c-2.22.48-2.69-1.07-2.69-1.07a2.12 2.12 0 00-.88-1.16c-.72-.5.05-.49.05-.49a1.7 1.7 0 011.24.84 1.72 1.72 0 002.36.67c.03-.5.3-.85.54-1.05-1.78-.2-3.64-.89-3.64-3.95a3.09 3.09 0 01.82-2.14 2.87 2.87 0 01.08-2.11s.67-.21 2.2.82a7.59 7.59 0 014 0c1.52-1.03 2.2-.82 2.2-.82.43 1.1.16 1.91.08 2.11a3.09 3.09 0 01.82 2.14c0 3.07-1.87 3.75-3.65 3.95.31.27.58.81.58 1.63v2.42c0 .21.15.46.56.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <Input
                {...register("socialLinks.github")}
                placeholder="GitHub URL"
                className="pl-10"
              />
              {errors.socialLinks?.github?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.socialLinks.github.message}
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.49 8.09h3.99V24H.49V8.09zM8.98 8.09h3.83v2.18h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.09V24h-4.01v-7.09c0-1.69-.03-3.87-2.36-3.87-2.36 0-2.72 1.85-2.72 3.75V24H8.98V8.09z" />
              </svg>
              <Input
                {...register("socialLinks.linkedin")}
                placeholder="LinkedIn URL"
                className="pl-10"
              />
              {errors.socialLinks?.linkedin?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.socialLinks.linkedin.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </span>
              ) : (
                "Update Profile"
              )}
            </Button>

            {/* Cancel */}
            {currentUser?.data?.profileUpdated && (
              <Button
                type="button"
                variant="ghost"
                className="w-full border mt-2 cursor-pointer"
                onClick={() => router.push(`/profile`)}
              >
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
