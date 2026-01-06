import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogGridCard } from "./blog-grid-card";
import type { BlogDTO } from "@/shared/api/api-types";

export const BlogsGrid = ({
  blogs,
  isFetchingNextPage,
}: {
  blogs: BlogDTO[];
  isFetchingNextPage?: boolean;
}) => {
  return (
    <section>
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {blogs?.map((blog) => (
          <BlogGridCard key={blog._id} blog={blog} />
        ))}
      </ul>
      <div>{isFetchingNextPage && <Spinner />}</div>
    </section>
  );
};
