import { useMyBlogs } from "./model/use-my-blogs";

const MyBlogsListPage = () => {
  const { myBlogs } = useMyBlogs();
  console.log(myBlogs);

  return <div>My Blogs List Page</div>;
};

export const Component = MyBlogsListPage;
