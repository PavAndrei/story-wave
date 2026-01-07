import { Clock, Flame, UserStar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import type { BlogDTO, UserDTO } from "@/shared/api/api-types";
import { Skeleton } from "@/shared/ui/kit/skeleton";

export const TopBlogsSkeleton = ({ count = 5 }: { count: number }) => {
  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </li>
      ))}
    </ul>
  );
};
export const TopAuthorsSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </li>
      ))}
    </>
  );
};

export const BlogsListLayoutDiscoveryColumn = ({
  topBlogs,
  topAuthors,
  recentBlogs,
  isTopAuthorsLoading,
  isTopBlogsLoading,
  isRecentBlogsLoading,
}: {
  topBlogs?: BlogDTO[];
  topAuthors?: UserDTO[];
  recentBlogs?: BlogDTO[];
  isTopAuthorsLoading: boolean;
  isTopBlogsLoading: boolean;
  isRecentBlogsLoading: boolean;
}) => {
  return (
    <aside className="flex flex-col gap-6">
      {/* Trending blogs */}
      <section className="rounded-lg border border-slate-700 bg-slate-200 p-4">
        <header className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Flame className="h-4 w-4 text-red-600" />
          Trending blogs
        </header>

        <ul className="flex flex-col gap-2">
          {isTopBlogsLoading ? (
            <TopBlogsSkeleton count={10} />
          ) : (
            topBlogs?.map((blog, index) => (
              <li
                key={blog._id}
                className="group flex items-start gap-2 text-sm"
              >
                <span className="mt-0.5 text-xs text-slate-700">
                  {index + 1}
                </span>

                <Link
                  to={href(ROUTES.BLOG, { blogId: blog._id })}
                  className="line-clamp-2 text-slate-700 transition-colors group-hover:text-white"
                >
                  {blog.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
      {/* Top authors */}
      <section className="rounded-lg border border-slate-700 bg-slate-200 p-4">
        <header className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <UserStar className="h-4 w-4 text-red-600" />
          Top authors
        </header>

        <ul className="flex flex-col gap-3">
          {isTopAuthorsLoading ? (
            <TopAuthorsSkeleton count={5} />
          ) : (
            topAuthors?.map((author) => (
              <li key={author._id} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {author.avatarUrl ? (
                    <AvatarImage src={author.avatarUrl} />
                  ) : (
                    <AvatarFallback>
                      <UserStar className="h-4 w-4 text-slate-700" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-700">
                    {author.username}
                  </p>
                  <p className="text-xs text-slate-700">
                    {author?.totalBlogs} blogs
                  </p>
                  <p className="text-xs text-slate-700">
                    {author?.totalViews} views
                  </p>
                </div>
              </li>
            ))
          )}
          ,
        </ul>
      </section>
      <section className="rounded-lg border border-slate-700 bg-slate-200 p-4">
        <div className="flex flex-col gap-2">
          <header className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock className="h-4 w-4 text-red-600" />
            Recent blogs
          </header>

          {isRecentBlogsLoading ? (
            <TopBlogsSkeleton count={10} />
          ) : (
            recentBlogs?.map((blog) => (
              <li
                key={blog._id}
                className="group flex items-center gap-2 text-sm"
              >
                <div className="size-6 rounded-2xl">
                  <img
                    className="size-full rounded-2xl object-cover"
                    src={blog.coverImgUrl}
                    alt={blog.title}
                  />
                </div>

                <Link
                  to={href(ROUTES.BLOG, { blogId: blog._id })}
                  className="line-clamp-2 text-slate-700 transition-colors group-hover:text-white"
                >
                  {blog.title}
                </Link>
              </li>
            ))
          )}
          {recentBlogs?.length === 0 &&
            "No recent blogs. Read some blogs and they will appear here."}
        </div>
      </section>
    </aside>
  );
};
