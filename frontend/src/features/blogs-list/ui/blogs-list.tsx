import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogCard } from "./blog-card";
import type { Blog } from "@/shared/api/api";

type Props = {
  blogs: Blog[];
  isFetchingNextPage: boolean;
};

export const BlogsList = ({ blogs, isFetchingNextPage }: Props) => {
  return (
    <section>
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {blogs?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </ul>
      <div>{isFetchingNextPage && <Spinner />}</div>
    </section>
  );
};
