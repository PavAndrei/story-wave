import { MarkdownRenderer } from "../markdown";
import { Heart } from "lucide-react";
import { useToggleLike } from "./use-toggle-like";
import { useBlog } from "./use-blog";
import { useMyProfile } from "@/shared/model/user";

const BlogPage = () => {
  const { blog } = useBlog();
  const { toggle, getLikeState } = useToggleLike();

  const { userData } = useMyProfile();

  if (!blog) return null;

  const { isLiked, likesCount } = getLikeState(blog);

  return (
    <div className="border rounded-md p-3 prose max-w-none overflow-auto">
      <MarkdownRenderer content={blog.content} onToggleTask={() => {}} />

      {userData ? (
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => toggle(blog)}
        >
          <Heart
            className={isLiked ? "fill-red-500 text-red-500" : "text-slate-500"}
          />
          <span>{likesCount}</span>
        </button>
      ) : (
        <span>
          {blog.likesCount} {blog.likesCount === 1 ? "person" : "people"} liked
          this blog
        </span>
      )}
    </div>
  );
};

export const Component = BlogPage;
