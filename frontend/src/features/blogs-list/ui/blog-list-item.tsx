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

export const BlogListItem = ({ blog }: { blog: BlogListItem }) => {
  return (
    <Card className="flex flex-row items-center gap-2 p-5 rounded-md border-slate-700 bg-slate-200">
      {/* Image */}
      {blog.coverImgUrl && (
        <div className="overflow-hidden rounded-md w-1/4 h-35 self-start">
          <img
            src={blog.coverImgUrl}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform"
          />
        </div>
      )}

      {/* Content */}
      <div className="w-full flex flex-col justify-center gap-4">
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
        <Button
          asChild
          className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 flex gap-2 mr-0 ml-auto"
        >
          <Link to={href(ROUTES.BLOG, { blogId: blog._id })}>View</Link>
        </Button>
      </div>
    </Card>
  );
};
