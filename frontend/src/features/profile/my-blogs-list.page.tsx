import { useMyBlogs } from "./model/use-my-blogs";
import { useMyBlogsFilters } from "./model/use-my-blogs-filters";
import { MyBlogsForm } from "./ui/my-blogs-form";
import { MyBlogsList } from "./ui/my-blogs-list";
import { ProfileLayout } from "./ui/profile-layout";

export type BlogsFilters = {
  status: "draft" | "published" | "archived" | undefined;
  sort: "newest" | "oldest";
  search: string;
  categories: string[];
};

const MyBlogsListPage = () => {
  const filtersState = useMyBlogsFilters();
  const { myBlogs } = useMyBlogs({ filters: filtersState.filters });

  return (
    <ProfileLayout
      title="My Blogs"
      description="List of your blogs"
      header={<MyBlogsForm {...filtersState} />}
      content={<MyBlogsList myBlogs={myBlogs} />}
      footerText={<></>}
    />
  );
};

export const Component = MyBlogsListPage;
