import type { Blog } from "@/shared/api/api";
import { BlogsList } from "./blogs-list";

export const BlogsListLayoutContent = ({
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  cursorRef,
}: {
  items: Blog[];
  isLoading?: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  cursorRef?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <section>
      {isLoading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <BlogsList blogs={items} isFetchingNextPage={isFetchingNextPage} />
        </>
      )}

      {hasNextPage && <div ref={cursorRef} className="h-10" />}
    </section>
  );
};
