"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { Pencil, ArrowLeft, Loader2 } from "lucide-react";
import { useUpdateIdea, useIdeaById } from "@/features/ideas/hooks/useIdeas";
import { useTags } from "@/features/tags/hooks/useTags";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useEffect } from "react";
import { Tag } from "@/types/types";

const formSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  tags: z
    .array(z.string())
    .min(2, "Select at least 2 tags")
    .max(4, "You can select at most 4 tags"),
  roles: z.string().optional(),
});

export default function EditSeedletPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: tagsData = [] } = useTags();
  const { data: ideaData, isLoading } = useIdeaById(id as string);
  const updateIdea = useUpdateIdea(id as string);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: [],
    },
  });

  // Prefill form
  useEffect(() => {
    if (ideaData?.data?.idea) {
      const idea = ideaData.data.idea;
      setValue("title", idea.title);
      setValue("description", idea.description);
      setValue("tags", idea.tags?.map((t: Tag) => t.name) || []);
      setValue("roles", idea.neededRoles?.join(", ") || "");
    }
  }, [ideaData, setValue]);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading Seedlet...</div>
    );
  }

  if (!ideaData?.data?.idea) {
    return (
      <div className="p-10 text-center text-gray-500">
        Seedlet not found or you are not the owner.
      </div>
    );
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const rolesArray = data.roles
      ? data.roles
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean)
      : [];

    updateIdea.mutate(
      {
        title: data.title,
        description: data.description,
        tags: data.tags,
        neededRoles: rolesArray,
      },
      {
        onSuccess: () => {
          toast.success("Seedlet updated!");
          router.push(`/seedlets/${id}`);
        },
        onError: () => {
          toast.error("Failed to update Seedlet, please try again.");
        },
      }
    );
  };

  const tagOptions: Option[] = tagsData.map((tag: Tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-manrope">
      {/* Back button */}
      <button
        onClick={() => router.push(`/seedlets/${id}`)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-black cursor-pointer hover:underline transition"
      >
        <ArrowLeft size={16} />
        Back to Seedlet
      </button>
      <Card>
        <CardHeader className="mb-4">
          <h2 className="text-2xl font-bold text-[#42B883] flex items-center gap-2">
            <Pencil size={22} />
            Edit Seedlet
          </h2>
          <p className="text-muted-foreground text-sm">
            Update your idea details and keep collaborators in the loop.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Title
              </label>
              <Input {...register("title")} />
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
              <Label className="block text-sm font-medium mb-1 text-[#333]">
                Tags{" "}
                <span className="text-gray-500 text-xs">(min 2, max 4)</span>
              </Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultipleSelector
                    value={field.value.map((tag: string) => ({
                      value: tag,
                      label: tag,
                    }))}
                    onChange={(options) =>
                      field.onChange(
                        options.map((opt: Option) =>
                          opt.value.toLowerCase().trim()
                        )
                      )
                    }
                    options={tagOptions}
                    placeholder="Select tags"
                    commandProps={{ label: "Available tags" }}
                    emptyIndicator={
                      <p className="text-center text-sm">No tags found</p>
                    }
                    maxSelected={4}
                    onMaxSelected={() =>
                      toast.error("You can select up to 4 tags only")
                    }
                    creatable
                  />
                )}
              />
              {errors.tags && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tags.message as string}
                </p>
              )}
            </div>

            {/* Needed roles */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#333]">
                Who are you looking for?{" "}
                <span className="text-gray-500 text-xs">(comma-seperated)</span>
              </label>
              <Input {...register("roles")} />
            </div>

            <Button
              type="submit"
              disabled={updateIdea.isPending}
              className="w-full bg-[#42B883] hover:bg-[#36A273] text-white font-semibold cursor-pointer"
            >
              {updateIdea.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
