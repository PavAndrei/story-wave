import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Card } from "@/shared/ui/kit/card";
import { Button } from "@/shared/ui/kit/button";

export type BlogListItem = {
  _id: string;
  title: string;
  content: string;
  coverImgUrl?: string | null;
  categories: string[];
  authorId: {
    _id: string;
    username: string;
  };
  createdAt: string;
  publishedAt?: string;
};

export const BlogCard = ({ blog }: { blog: BlogListItem }) => {
  return (
    <Card className="flex flex-col gap-2 p-0 rounded-md border-slate-700 bg-slate-200">
      {/* Cover */}
      {blog.coverImgUrl && (
        <div className="h-60 w-full overflow-hidden rounded-md">
          <img
            src={blog.coverImgUrl}
            alt={blog.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 h-2/3">
        <h3 className="text-lg font-semibold text-slate-700 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-3">
          {blog.content.slice(0, 140)}…
        </p>

        {/* Meta */}
        <div className="flex justify-between text-xs text-slate-500 mt-auto mb-0">
          <span>@{blog.authorId.username}</span>
          {blog.publishedAt && (
            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
          )}
        </div>
        <Button asChild>
          <Link to={href(ROUTES.BLOG, { blogId: blog._id })}>View</Link>
        </Button>
      </div>
    </Card>
  );
};
