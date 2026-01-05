import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogGridCard, type BlogGridItem } from "./blog-grid-card";

type Props = {
  blogs: BlogGridItem[];
  isFetchingNextPage?: boolean;
};

export const BlogsGrid = ({ blogs, isFetchingNextPage }: Props) => {
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
