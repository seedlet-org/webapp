"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sprout, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  tags: z.string().min(1, "Please enter at least one tag"),
  roles: z.string().optional(),
});

export default function NewSeedletPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const tagsArray = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    console.log("Submitted:", { ...data, tags: tagsArray });
    toast.success("Seedlet created!");
    router.push("/seedlets");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-manrope">
      {/* Back Button */}
      <button
        onClick={() => router.push("/seedlets")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-black cursor-pointer hover:underline transition"
      >
        <ArrowLeft size={16} />
        Back to Seedlets
      </button>
      <Card>
        <CardHeader className="mb-4">
          <h2 className="text-2xl font-bold text-[#42B883] flex items-center gap-2">
            <Sprout size={22} />
            Create a New Seedlet
          </h2>
          <p className="text-muted-foreground text-sm">
            Share your idea with the community and attract collaborators.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Title
              </label>
              <Input
                {...register("title")}
                placeholder="e.g. AI-Powered Study Buddy"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Briefly describe your idea, problem it solves, or the goal..."
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Tags (comma-separated)
              </label>
              <Input
                {...register("tags")}
                placeholder="e.g. ai, fintech, edtech"
              />
              {errors.tags && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tags.message}
                </p>
              )}
            </div>

            {/* Needed Roles */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Who are you looking for?
              </label>
              <Input
                {...register("roles")}
                placeholder="e.g. Need frontend dev, co-founder..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#42B883] hover:bg-[#36A273] text-white font-semibold cursor-pointer"
            >
              Post Seedlet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
