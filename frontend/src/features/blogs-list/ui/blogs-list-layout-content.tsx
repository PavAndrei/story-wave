import type { Blog } from "@/shared/api/api";
import { BlogsGrid } from "./blogs-grid";
import { BlogsList } from "./blogs-list";

export const BlogsListLayoutContent = ({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  cursorRef,
  viewMode,
}: {
  items: Blog[];
  isLoading?: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  cursorRef?: React.Ref<HTMLDivElement>;
  viewMode?: "list" | "grid";
}) => {
  return (
    <section>
      {isLoading ? (
        <p className="text-slate-400">Loading…</p>
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

      {hasNextPage && <div ref={cursorRef} className="h-10" />}
    </section>
  );
};
