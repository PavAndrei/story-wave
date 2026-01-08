import { useState } from "react";
import { BlogListLayout } from "./ui/blogs-list-layout";
import { BlogsListLayoutContent } from "./ui/blogs-list-layout-content";
import { BlogsListLayoutHeader } from "./ui/blogs-list-layout-header";
import { BlogsListLayoutSidebar } from "./ui/blogs-list-layout-sidebar";
import { BlogsListLayoutTemplates } from "./ui/blogs-list-layout-templates";
import { useBlogsFilters } from "./model/use-blogs-filters";
import { useRecentBlogs } from "./model/use-recent-blogs";
import { useMyProfile } from "@/shared/model/user";
import { useRecentBlogsLocalStorage } from "./model/use-recent-blogs-local";

const BlogsListRecentPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const { userData } = useMyProfile();

  const filtersState = useBlogsFilters();
  const { blogs } = useRecentBlogs({
    filters: filtersState.filters,
    enabled: !!userData,
  });

  const local = useRecentBlogsLocalStorage({
    enabled: !userData,
  });

  const enableViewMode = blogs.length > 0 || local.blogs.length > 0;

  return (
    <BlogListLayout
      header={
        <BlogsListLayoutHeader
          title="Last viewed blogs"
          description="Your recently viewed blogs are listed here."
          viewMode={viewMode}
          changeViewMode={setViewMode}
          enableViewMode={enableViewMode}
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
      <BlogsListLayoutContent
        viewMode={viewMode}
        items={userData ? blogs : local.blogs}
        enabled={true}
      />
    </BlogListLayout>
  );
};

export const Component = BlogsListRecentPage;
