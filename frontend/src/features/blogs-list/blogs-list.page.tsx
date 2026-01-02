import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Link, href } from "react-router-dom";
import { BlogCard } from "./blog-card";
import { BlogFilters } from "./blogs-filters";
import { useBlogsFilters } from "./use-blogs-filters";
import { useBlogsInfinite } from "./use-blogs-inifinity";
import { Spinner } from "@/shared/ui/kit/spinner";

const BlogsListPage = () => {
  const filtersState = useBlogsFilters();
  const { blogs, cursorRef, isFetchingNextPage, isLoading } = useBlogsInfinite(
    filtersState.filters,
  );

  console.log(filtersState.filters);

  return (
    <main className="max-w-[1440px] px-4 mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Latest articles</h1>

        <Button asChild>
          <Link to={href(ROUTES.CREATE_BLOG)}>Create new blog</Link>
        </Button>
      </div>

      <div className="max-w-[1440px] px-4 mx-auto py-6 flex gap-6">
        <aside className="w-[280px] shrink-0">
          <BlogFilters {...filtersState} />
        </aside>

        {/* Content */}
        {isLoading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <>
            <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {blogs?.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </ul>
            <div>{isFetchingNextPage && <Spinner />}</div>
            <div ref={cursorRef} className="h-10" />
          </>
        )}
      </div>
    </main>
  );
};

export const Component = BlogsListPage;
