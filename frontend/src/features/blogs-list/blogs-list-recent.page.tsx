import { useState } from "react";
import { BlogListLayout } from "./ui/blogs-list-layout";
import { BlogsListLayoutContent } from "./ui/blogs-list-layout-content";
import { BlogsListLayoutHeader } from "./ui/blogs-list-layout-header";
import { BlogsListLayoutSidebar } from "./ui/blogs-list-layout-sidebar";
import { BlogsListLayoutTemplates } from "./ui/blogs-list-layout-templates";
import { useBlogsFilters } from "./model/use-blogs-filters";
import { useRecentBlogs } from "./model/use-recent-blogs";

const BlogsListRecentPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const filtersState = useBlogsFilters();
  const { blogs } = useRecentBlogs();

  return (
    <BlogListLayout
      header={
        <BlogsListLayoutHeader
          title="Last viewed blogs"
          description="Your recently viewed blogs are listed here."
          viewMode={viewMode}
          changeViewMode={setViewMode}
        />
      }
      sidebar={
        <BlogsListLayoutSidebar
          filtersState={filtersState}
          enableFilters={false}
        />
      }
      templates={<BlogsListLayoutTemplates />}
      discoveryColumn={null}
    >
      <BlogsListLayoutContent viewMode={viewMode} items={blogs} />
    </BlogListLayout>
  );
};

export const Component = BlogsListRecentPage;
