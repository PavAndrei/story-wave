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

const createPostSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  categories: z.array(z.string()),
  coverImgUrl: z.string(),
  imagesUrls: z.array(z.string()),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

const categoryOptions = [
  { label: "Tech", value: "tech" },
  { label: "Life", value: "life" },
  { label: "Sport", value: "sport" },
  { label: "Business", value: "business" },
];

export const CreatePostForm = () => {
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      categories: [],
      coverImgUrl: "",
      imagesUrls: [],
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
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
              <FormLabel className="text-slate-700 font-medium text-base">
                Title
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="The title of your story"
                  className="border border-slate-700 placeholder:text-slate-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content (Markdown) */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Content (Markdown)
              </FormLabel>

              <div className="grid grid-cols-2 gap-4">
                <FormControl>
                  <Textarea
                    {...field}
                    rows={14}
                    placeholder="Write your story in markdown..."
                    className="border border-slate-700 placeholder:text-slate-400"
                  />
                </FormControl>

                <div className="border rounded-md p-3 text-sm prose prose-slate max-w-none overflow-auto">
                  <ReactMarkdown>
                    {field.value || "Markdown preview"}
                  </ReactMarkdown>
                </div>
              </div>

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
              <FormLabel className="text-slate-700 font-medium text-base">
                Categories
              </FormLabel>
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

        {/* Cover image */}
        {/* <FormField
          control={form.control}
          name="coverImgUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Cover image
              </FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Post images */}
        {/* <FormField
          control={form.control}
          name="imagesUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Images
              </FormLabel>
              <FormControl>
                <ImageUploader value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <ImageUploader />

        <div>
          <Button type="submit" className="mt-4">
            Create post
          </Button>
        </div>
      </form>
    </Form>
  );
};
