import { MyBlogsList } from "./ui/my-blogs-list";
import { ProfileLayout } from "./ui/profile-layout";

export type BlogsFilters = {
  status: "all" | "draft" | "published" | "archived";
  sort: "newest" | "oldest";
  search: string;
  categories: string[];
};

const MyBlogsListPage = () => {
  return (
    <ProfileLayout
      title="My Blogs"
      description="List of your blogs"
      header={<></>}
      content={<MyBlogsList />}
      footerText={<></>}
    />
  );
};

export const Component = MyBlogsListPage;
