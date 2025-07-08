"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, FlaskConical, FileText, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const newLabSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  collaborators: z
    .string()
    .min(1, "Please enter at least one collaborator")
    .refine(
      (val) =>
        val
          .split(",")
          .map((c) => c.trim())
          .every(
            (c) => /^@[\w-]+$/.test(c) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)
          ),
      {
        message:
          "Each collaborator must be a valid email or start with @ (e.g. @john or jane@example.com)",
      }
    ),
});

type NewLabSchema = z.infer<typeof newLabSchema>;

export default function NewLabPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewLabSchema>({
    resolver: zodResolver(newLabSchema),
  });

  const onSubmit = (data: NewLabSchema) => {
    const collaboratorsArray = data.collaborators
      .split(",")
      .map((c) => c.trim());

    const payload = {
      title: data.title,
      summary: data.summary,
      collaborators: collaboratorsArray,
    };

    console.log("Submit payload:", payload);
    toast.success("Lab created!");
    router.push("/lab");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-manrope">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-black cursor-pointer hover:underline transition"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Labs
      </button>

      <Card className="shadow-md rounded-xl border">
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#42B883] flex items-center gap-2">
            <FlaskConical size={24} />
            Create a New Lab
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kickstart a collaborative space to bring your idea to life.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="relative">
              <FileText
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                placeholder="Lab title"
                className="pl-10"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="relative">
              <Textarea
                placeholder="Lab summary or description..."
                className="pl-4 pt-3"
                rows={5}
                {...register("summary")}
              />
              {errors.summary && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.summary.message}
                </p>
              )}
            </div>

            {/* Collaborators */}
            <div className="relative">
              <Users
                className="absolute left-3 top-1/4 mt-1 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                placeholder="Add collaborators (comma-separated emails or usernames)"
                className="pl-10"
                {...register("collaborators")}
              />
              <p className="text-xs text-muted-foreground mt-1 pl-1">
                Example: jane@example.com, @john_dev, @alex
              </p>
              {errors.collaborators && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.collaborators.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full cursor-pointer">
              Create Lab
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
