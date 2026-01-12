import type { BlogDTO } from "@/shared/api/api-types";
import { useTrendingBlogs } from "./use-trending-blogs";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

type TrendingCardProps = {
  blog: BlogDTO;
  rank: 1 | 2 | 3;
  className?: string;
  isFeatured?: boolean;
};

const TrendingCard = ({
  blog,
  rank,
  className = "",
  isFeatured = false,
}: TrendingCardProps) => {
  return (
    <Link
      to={`/blog/${blog._id}`}
      className={[
        "group relative w-[300px] overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
        className,
      ].join(" ")}
    >
      {/* Rank badge */}
      <div className="absolute left-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
        #{rank}
      </div>

      {/* Cover */}
      <div className="h-[55%] overflow-hidden">
        <img
          src={blog.coverImgUrl}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex h-[45%] flex-col justify-between p-4">
        <div>
          <h3
            className={[
              "line-clamp-2 font-semibold",
              isFeatured ? "text-lg" : "text-base",
            ].join(" ")}
          >
            {blog.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            by {blog.authorId.username}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {blog.viewsCount}
          </span>

          <span className="flex items-center gap-1">
            <Heart size={14} />
            {blog.likesCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const TrendingSection = () => {
  const { trendingBlogs } = useTrendingBlogs();

  if (!trendingBlogs?.length) return null;

  const [first, second, third] = trendingBlogs.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-[1460px] px-4 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-semibold">Trending Blogs</h2>
        <p className="text-slate-500">
          Most read and discussed blogs from the community
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-6">
        {/* 🥈 Second place */}
        {second && (
          <TrendingCard blog={second} rank={2} className="h-[280px]" />
        )}

        {/* 🥇 First place */}
        {first && (
          <TrendingCard
            blog={first}
            rank={1}
            className="h-[340px]"
            isFeatured
          />
        )}

        {/* 🥉 Third place */}
        {third && <TrendingCard blog={third} rank={3} className="h-60" />}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/blogs"
          className="text-sm font-medium text-cyan-600 hover:underline"
        >
          View all blogs →
        </Link>
      </div>
    </section>
  );
};
