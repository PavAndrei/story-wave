import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogCard, type BlogListItem } from "./blog-card";

type Props = {
  blogs: BlogListItem[];
  isFetchingNextPage: boolean;
};

export const BlogsList = ({ blogs, isFetchingNextPage }: Props) => {
  return (
    <section>
      <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {blogs?.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </ul>
      <div>{isFetchingNextPage && <Spinner />}</div>
    </section>
  );
};
