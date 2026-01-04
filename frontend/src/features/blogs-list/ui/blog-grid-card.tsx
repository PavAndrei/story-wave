import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Card } from "@/shared/ui/kit/card";
import { Button } from "@/shared/ui/kit/button";
import { Toggle } from "@/shared/ui/kit/toggle";
import { Star } from "lucide-react";
import { useToggleFavorite } from "../model/use-toggle-favorite";

export type BlogGridItem = {
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
  likesCount: number;
  viewsCount: number;
  isFavorite?: boolean;
};

export const BlogGridCard = ({ blog }: { blog: BlogGridItem }) => {
  const { getFavoritesState, toggle } = useToggleFavorite();

  const { isFavorite } = getFavoritesState(blog);

  return (
    <Card className="flex flex-col gap-2 p-0 rounded-md border-slate-700 bg-slate-200 relative">
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
        <Button
          asChild
          className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 flex gap-2"
        >
          <Link to={href(ROUTES.BLOG, { blogId: blog._id })}>View</Link>
        </Button>
        <div className="text-xs font-light flex justify-between items-center text-slate-600">
          <div>{blog.viewsCount > 0 && `${blog.viewsCount} views`}</div>
          <div>{blog.likesCount > 0 && `${blog.likesCount} likes`}</div>
        </div>
      </div>

      <Toggle
        aria-label="Toggle bookmark"
        size="sm"
        variant="outline"
        pressed={isFavorite}
        onPressedChange={() => toggle(blog)}
        className="data-[state=on]:bg-slate-200 data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-cyan-600 size-8 absolute top-2 right-2 bg-slate-200 cursor-pointer text-slate-700 hover:bg-slate-200 hover:text-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 ease-in-out active:scale-95"
      >
        <Star />
      </Toggle>
    </Card>
  );
};
