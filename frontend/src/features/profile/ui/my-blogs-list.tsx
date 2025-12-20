import type { Blog } from "@/shared/api/api";
import { MyBlogItem } from "./my-blog-item";

export const MyBlogsList = ({ myBlogs = [] }: { myBlogs?: Blog[] }) => {
  return (
    <section>
      <ul className="flex flex-col gap-4">
        {myBlogs &&
          myBlogs.map((blog: Blog) => <MyBlogItem key={blog._id} {...blog} />)}
      </ul>
    </section>
  );
};
