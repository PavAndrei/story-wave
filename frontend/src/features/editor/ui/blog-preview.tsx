import { useWatch, type UseFormReturn } from "react-hook-form";
import { MarkdownRenderer } from "@/features/markdown";
import type { PublishBlogFormValues } from "../model/use-blog-editor";

type Props = {
  form: UseFormReturn<PublishBlogFormValues>;
};

export const BlogPreview = ({ form }: Props) => {
  const title = useWatch({ control: form.control, name: "title" });
  const content = useWatch({ control: form.control, name: "content" });
  const coverImage = useWatch({
    control: form.control,
    name: "coverImage",
  });

  return (
    <article className="prose prose-neutral max-w-none">
      {coverImage?.url && (
        <img
          src={coverImage.url}
          alt="Cover"
          className="w-full max-h-96 object-cover rounded-md mb-6"
        />
      )}

      <h1>{title}</h1>

      <MarkdownRenderer onToggleTask={() => {}} content={content} />
    </article>
  );
};
