import type { BlogDTO } from "@/shared/api/api-types";
import { BlogsGrid } from "./blogs-grid";
import { BlogsList } from "./blogs-list";
import { Card } from "@/shared/ui/kit/card";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { href, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

const BlogsListSkeleton = ({
  mode,
}: {
  mode: "grid" | "list";
  count?: number;
}) => {
  if (mode === "list") {
    return (
      <ul className="flex flex-col gap-4 items-center">
        {Array.from({ length: 12 }).map((_, index) => (
          <li key={index}>
            <Card className="relative flex flex-row items-center gap-2 p-5 rounded-md border-slate-700 bg-slate-200">
              {/* Image */}
              <Skeleton className="overflow-hidden rounded-md w-1/4 h-35 self-start" />

              {/* Content */}
              <div className="w-full flex flex-col justify-center gap-4">
                <Skeleton className="" />
                <Skeleton className="text-sm text-slate-600 line-clamp-3" />

                {/* Meta */}
                <Skeleton className="mt-auto mb-0">
                  <Skeleton />
                </Skeleton>
                <Skeleton className="py-2 px-4 mr-0 ml-auto" />
              </div>
              <Skeleton className="absolute top-2 right-2 rounded" />
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  if (mode === "grid") {
    return (
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <li key={index}>
            <Card className="flex flex-col gap-2 p-0 rounded-md relative">
              {/* Cover */}
              <Skeleton className="h-60 w-full overflow-hidden rounded-md" />

              <div className="p-4 flex flex-col gap-3">
                {/* Content */}
                <div className="flex flex-col gap-3 h-2/3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-10" />
                </div>
                {/* Meta */}
                <div className="flex justify-between">
                  <Skeleton className="w-15 h-5" />
                  <Skeleton className="w-15 h-5" />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    );
  }
};

const NoBlogsWarning = () => {
  return (
    <section className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-700 bg-slate-200 p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
          <Lock className="h-6 w-6 text-cyan-600" />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">No blogs found</h2>

        <p className="text-sm text-slate-600">
          We couldn&apos;t find any blogs that match your search criteria.
        </p>
      </div>
    </section>
  );
};

const NotAuthorizedWarning = () => {
  return (
    <section className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-700 bg-slate-200 p-6">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10">
          <Lock className="h-6 w-6 text-cyan-600" />
        </div>

        <h2 className="text-lg font-semibold text-slate-800">
          Authentication required
        </h2>

        <p className="text-sm text-slate-600">
          This page is available only to authenticated users. Please sign in to
          access personalized content, manage your data, and unlock all features
          of the platform.
        </p>

        <Link
          to={href(ROUTES.LOGIN)}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500"
        >
          Go to login
        </Link>
      </div>
    </section>
  );
};

export const BlogsListLayoutContent = ({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  cursorRef,
  viewMode,
  enabled = true,
}: {
  items: BlogDTO[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  cursorRef?: React.Ref<HTMLDivElement>;
  viewMode: "list" | "grid";
  enabled: boolean;
}) => {
  if (!enabled && !isLoading) {
    return <NotAuthorizedWarning />;
  }

  if ((!items || items.length <= 0) && !isLoading) {
    return <NoBlogsWarning />;
  }

  return (
    <section>
      {isLoading ? (
        <BlogsListSkeleton count={12} mode={viewMode} />
      ) : (
        <>
          {viewMode === "list" && (
            <BlogsList blogs={items} isFetchingNextPage={isFetchingNextPage} />
          )}
          {viewMode === "grid" && (
            <BlogsGrid blogs={items} isFetchingNextPage={isFetchingNextPage} />
          )}
        </>
      )}
      {isFetchingNextPage && <BlogsListSkeleton count={12} mode={viewMode} />}
      {hasNextPage && <div ref={cursorRef} className="h-10" />}
    </section>
  );
};
