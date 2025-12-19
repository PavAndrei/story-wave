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
import { Textarea } from "@/shared/ui/kit/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import ReactMarkdown from "react-markdown";
import { ImageUploader } from "@/features/uploads";
import { useParams } from "react-router-dom";

const createPostSchema = z.object({
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

type CreatePostFormValues = z.infer<typeof createPostSchema>;

const categoryOptions = [
  { label: "Tech", value: "tech" },
  { label: "Life", value: "life" },
  { label: "Sport", value: "sport" },
  { label: "Business", value: "business" },
];

export const CreatePostForm = () => {
  const { blogId } = useParams();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      coverImage: null,
      images: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    const payload = {
      title: data.title,
      content: data.content,
      categories: data.categories,
      coverImgUrl: data.coverImage?.url ?? null,
      imagesUrls: data.images.map((img) => img.url),
    };

    console.log(payload);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-5"
        noValidate
      >
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
                <Select
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
              <FormLabel>Content (Markdown)</FormLabel>

              <div className="grid grid-cols-2 gap-4">
                <FormControl>
                  <Textarea
                    {...field}
                    rows={14}
                    placeholder="Write your story in markdown..."
                    className="resize-none min-h-[300px]"
                  />
                </FormControl>

                <div className="border rounded-md p-3 prose max-w-none overflow-auto">
                  <ReactMarkdown>
                    {field.value || "Markdown preview"}
                  </ReactMarkdown>
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUploader
                  blogId={blogId || ""}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover */}
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image</FormLabel>
              <FormControl>
                <ImageUploader
                  blogId={blogId || ""}
                  value={field.value ? [field.value] : []}
                  max={1}
                  onChange={(images) => field.onChange(images[0] ?? null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create post</Button>
      </form>
    </Form>
  );
};
