import { useBlogsFilters } from "./model/use-blogs-filters";
import { useBlogsInfinite } from "./model/use-blogs-inifinity";
import { BlogListLayout } from "./ui/blogs-list-layout";
import { BlogsListLayoutHeader } from "./ui/blogs-list-layout-header";
import { BlogsListLayoutContent } from "./ui/blogs-list-layout-content";
import { BlogsListLayoutSidebar } from "./ui/blogs-list-layout-sidebar";
import { BlogsListLayoutTemplates } from "./ui/blogs-list-layout-templates";
import { BlogsListLayoutDiscoveryColumn } from "./ui/blogs-list-layout-discovery-column";
import { useState } from "react";

const BlogsListPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const filtersState = useBlogsFilters();
  const { blogs, cursorRef, isFetchingNextPage, isLoading, hasNextPage } =
    useBlogsInfinite(filtersState.filters);

  return (
    <BlogListLayout
      header={
        <BlogsListLayoutHeader
          title="Insights & Analysis"
          description="Deep dives, industry trends, and expert perspectives to inform your decisions."
          viewMode={viewMode}
          changeViewMode={setViewMode}
        />
      }
      sidebar={<BlogsListLayoutSidebar filtersState={filtersState} />}
      templates={<BlogsListLayoutTemplates />}
      discoveryColumn={<BlogsListLayoutDiscoveryColumn />}
    >
      <BlogsListLayoutContent
        viewMode={viewMode}
        items={blogs}
        isFetchingNextPage={isFetchingNextPage}
        cursorRef={cursorRef}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
      />
    </BlogListLayout>
  );
};

export const Component = BlogsListPage;
