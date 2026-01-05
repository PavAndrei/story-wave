import { Spinner } from "@/shared/ui/kit/spinner";
import { BlogListItem } from "./blog-list-item";
type Props = {
  blogs: BlogListItem[];
  isFetchingNextPage?: boolean;
};

export const BlogsList = ({ blogs, isFetchingNextPage }: Props) => {
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
