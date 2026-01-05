import { useState } from "react";
import { BlogListLayout } from "./ui/blogs-list-layout";
import { BlogsListLayoutContent } from "./ui/blogs-list-layout-content";
import { BlogsListLayoutHeader } from "./ui/blogs-list-layout-header";
import { BlogsListLayoutSidebar } from "./ui/blogs-list-layout-sidebar";
import { BlogsListLayoutTemplates } from "./ui/blogs-list-layout-templates";
import { useBlogsFilters } from "./model/use-blogs-filters";
import { useBlogsFavoritesInfinite } from "./model/use-blogs-favorites-infinity";

const BlogsListFavoritePage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const filtersState = useBlogsFilters();
  const {
    blogs,
    cursorRef,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    pagination,
  } = useBlogsFavoritesInfinite(filtersState.filters);

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
        <BlogsListLayoutSidebar
          filtersState={filtersState}
          enableFilters={false}
          total={pagination?.total}
        />
      }
      templates={<BlogsListLayoutTemplates />}
      discoveryColumn={null}
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

export const Component = BlogsListFavoritePage;
