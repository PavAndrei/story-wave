import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogListItem } from "./blog-list-item";
import type { BlogDTO } from "@/shared/api/api-types";

export const BlogsList = ({
  blogs,
  isFetchingNextPage,
}: {
  blogs: BlogDTO[];
  isFetchingNextPage?: boolean;
}) => {
  return (
    <section>
      <ul className="flex flex-col gap-4 items-center">
        {blogs?.map((blog) => (
          <BlogListItem key={blog._id} blog={blog} />
        ))}
      </ul>
      <div>{isFetchingNextPage && <Spinner />}</div>
    </section>
  );
};
