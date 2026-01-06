import { useBlogsFilters } from "./model/use-blogs-filters";
import { useBlogsInfinite } from "./model/use-blogs-inifinity";
import { BlogListLayout } from "./ui/blogs-list-layout";
import { BlogsListLayoutHeader } from "./ui/blogs-list-layout-header";
import { BlogsListLayoutContent } from "./ui/blogs-list-layout-content";
import { BlogsListLayoutSidebar } from "./ui/blogs-list-layout-sidebar";
import { BlogsListLayoutTemplates } from "./ui/blogs-list-layout-templates";
import { BlogsListLayoutDiscoveryColumn } from "./ui/blogs-list-layout-discovery-column";
import { useState } from "react";
import { useGetTopBlogs } from "./model/use-get-top-blogs";
import { useBlogsTopAuthors } from "./model/use-blogs-top-authors";

const BlogsListPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const { topBlogs } = useGetTopBlogs();
  const { topAuthors } = useBlogsTopAuthors();

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
      sidebar={
        <BlogsListLayoutSidebar filtersState={filtersState} enableFilters />
      }
      templates={<BlogsListLayoutTemplates />}
      discoveryColumn={
        <BlogsListLayoutDiscoveryColumn
          topBlogs={topBlogs}
          topAuthors={topAuthors}
        />
      }
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
