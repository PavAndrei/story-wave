import { MarkdownRenderer } from "../markdown";
import { Eye, Heart } from "lucide-react";
import { useToggleLike } from "./use-toggle-like";
import { useBlog } from "./use-blog";
import { useMyProfile } from "@/shared/model/user";
import { useBlogView } from "./use-blog-view";
import { BlogFavoriteCardToggler } from "../blog-favorite";
import { useAddRecentBlog } from "./use-add-recent-blog";
import { useAddRecentBlogLocalStorage } from "./use-add-recent-blog-local";

const BlogPage = () => {
  const { blog } = useBlog();
  const { toggle, getLikeState } = useToggleLike();
  useBlogView(blog?._id);

  const { userData } = useMyProfile();

  useAddRecentBlog(blog?._id, !!userData);

  useAddRecentBlogLocalStorage({
    blog,
    options: {
      enabled: !userData,
      limit: 10,
    },
  });

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
      <div className="flex items-center gap-2">
        <Eye />
        {blog.viewsCount}
      </div>
      <BlogFavoriteCardToggler blog={blog} className="static" />
    </div>
  );
};

export const Component = BlogPage;
