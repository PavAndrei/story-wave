import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Link, href } from "react-router-dom";
import { useBlogsFilters } from "./model/use-blogs-filters";
import { useBlogsInfinite } from "./model/use-blogs-inifinity";
import { BlogFilters } from "./ui/blogs-filters";
import { BlogsList } from "./ui/blogs-list";

const BlogsListPage = () => {
  const filtersState = useBlogsFilters();
  const { blogs, cursorRef, isFetchingNextPage, isLoading, hasNextPage } =
    useBlogsInfinite(filtersState.filters);

  console.log(blogs);

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
            <BlogsList blogs={blogs} isFetchingNextPage={isFetchingNextPage} />
          </>
        )}
      </div>
      {hasNextPage && <div ref={cursorRef} className="h-10" />}
    </main>
  );
};

export const Component = BlogsListPage;
