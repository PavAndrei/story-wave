import type { Blog } from "@/shared/api/api";
import { MyBlogItem } from "./my-blog-item";
import { Spinner } from "@/shared/ui/kit/spinner";

type Props = {
  blogs: Blog[] | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
};

export const MyBlogsList = ({ blogs, isFetchingNextPage }: Props) => {
  if (!blogs || !blogs.length) {
    return <div>No blogs found</div>;
  }

  return (
    <section>
      <ul className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <MyBlogItem key={blog._id} {...blog} />
        ))}
      </ul>
      {isFetchingNextPage && <Spinner />}
    </section>
  );
};
