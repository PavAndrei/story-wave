import { useMyBlogs } from "../model/use-my-blogs";
import { MyBlogItem } from "./my-blog-item";

export const MyBlogsList = () => {
  const { myBlogs } = useMyBlogs();
  console.log(myBlogs);

  return (
    <section>
      <ul>
        {myBlogs &&
          myBlogs.map((blog) => <MyBlogItem key={blog._id} {...blog} />)}
      </ul>
    </section>
  );
};
