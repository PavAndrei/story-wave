import { Flame, User, UserStar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import type { Blog } from "@/shared/api/api";
import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";

const TOP_AUTHORS = [
  {
    id: "1",
    name: "Alex Johnson",
    postsCount: 24,
    avatar: null,
  },
  {
    id: "2",
    name: "Maria Petrova",
    postsCount: 18,
    avatar: null,
  },
  {
    id: "3",
    name: "Ivan Smirnov",
    postsCount: 15,
    avatar: null,
  },
];

export const BlogsListLayoutDiscoveryColumn = ({
  topBlogs,
}: {
  topBlogs: Blog[] | undefined;
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
          {topBlogs?.map((blog, index) => (
            <li key={blog._id} className="group flex items-start gap-2 text-sm">
              <span className="mt-0.5 text-xs text-slate-700">{index + 1}</span>

              <Link
                to={href(ROUTES.BLOG, { blogId: blog._id })}
                className="line-clamp-2 text-slate-700 transition-colors group-hover:text-white"
              >
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {/* Top authors */}
      <section className="rounded-lg border border-slate-700 bg-slate-200 p-4">
        <header className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <UserStar className="h-4 w-4 text-red-600" />
          Top authors
        </header>

        <ul className="flex flex-col gap-3">
          {TOP_AUTHORS.map((author) => (
            <li key={author.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {author.avatar ? (
                  <AvatarImage src={author.avatar} />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4 text-slate-700" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">{author.name}</p>
                <p className="text-xs text-slate-700">
                  {author.postsCount} posts
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      Recently viewed (optional, can be added later)
      <section className="rounded-lg border border-slate-700 bg-slate-200 p-4">
        <header className="mb-3 text-sm font-medium text-slate-700">
          Continue reading
        </header>
      </section>
    </aside>
  );
};
