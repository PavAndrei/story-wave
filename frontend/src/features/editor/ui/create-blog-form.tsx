import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import Multiselect from "react-select";
// import { ImageUploader } from "@/features/uploads";
import { useParams } from "react-router-dom";
import { usePublishBlog } from "../model/use-publish-blog";
import { useSaveDraft } from "@/shared/model/use-save-draft";
import { categoryOptions } from "@/shared/model/categories";
import { MarkdownEditor } from "@/features/markdown";
import { useDraftAutosave } from "@/shared/model/use-draft-autosave";
import { CoverImageUploader } from "@/features/uploads";

/* ---------- schema ONLY for publish ---------- */
const publishBlogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  categories: z.array(z.string()),
  coverImage: z
    .object({
      id: z.string(),
      url: z.string(),
    })
    .nullable(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    }),
  ),
});

type PublishBlogFormValues = z.infer<typeof publishBlogSchema>;

export const CreateBlogForm = () => {
  const { blogId } = useParams();

  const form = useForm<PublishBlogFormValues>({
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      coverImage: null,
      images: [],
    },
  });

  const publishBlog = usePublishBlog();
  const saveDraft = useSaveDraft();

  const content = useWatch({
    control: form.control,
    name: "content",
  });

  const autoSave = useDraftAutosave({
    blogId,
    title: form.watch("title"),
    content,
    categories: form.watch("categories"),
    coverImgUrl: form.watch("coverImage")?.url ?? undefined,
  });

  /* ---------- SAVE DRAFT (NO VALIDATION) ---------- */
  const handleSaveDraft = () => {
    const data = form.getValues();

    saveDraft.saveDraftFunction({
      blogId,
      status: "draft",
      title: data.title,
      content: data.content,
      categories: data.categories,
      coverImgUrl: data.coverImage?.url ?? null,
    });
  };

  /* ---------- PUBLISH (STRICT VALIDATION) ---------- */
  const handlePublish = async () => {
    const data = form.getValues();

    const result = publishBlogSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof PublishBlogFormValues;
        form.setError(field, {
          type: "manual",
          message: err.message,
        });
      });
      return;
    }

    publishBlog.publishBlog({
      blogId,
      status: "published",
      title: data.title,
      content: data.content,
      categories: data.categories,
      coverImgUrl: data.coverImage?.url ?? null,
    });
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col gap-5" noValidate>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="The title of your story" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories */}
        <Controller
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Multiselect
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    field.value.includes(opt.value),
                  )}
                  onChange={(values) =>
                    field.onChange(values.map((v) => v.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor
                  title={form.getValues("title")}
                  value={field.value}
                  onChange={field.onChange}
                  blogId={blogId!}
                  images={form.watch("images")}
                  onImagesChange={(imgs) => form.setValue("images", imgs)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <span className="text-xs text-muted">
          {autoSave.status === "saving" && "Saving…"}
          {autoSave.status === "saved" && autoSave.lastSavedAt && (
            <>Saved at {autoSave.lastSavedAt.toLocaleTimeString()}</>
          )}
          {autoSave.status === "error" && "Autosave failed"}
        </span>

        <div className="flex gap-3">
          <Button
            type="button"
            disabled={saveDraft.isPending}
            onClick={handleSaveDraft}
          >
            Save draft
          </Button>

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image</FormLabel>
                <FormControl>
                  <CoverImageUploader
                    blogId={blogId!}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            disabled={publishBlog.isPending}
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </form>
    </Form>
  );
};
