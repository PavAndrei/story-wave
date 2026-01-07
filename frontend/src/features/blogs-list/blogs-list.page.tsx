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
import { useRecentBlogs } from "./model/use-recent-blogs";
import { useMyProfile } from "@/shared/model/user";
import { useRecentBlogsLocalStorage } from "./model/use-recent-blogs-local";

const BlogsListPage = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const { topBlogs, isLoading: isTopBlogsLoading } = useGetTopBlogs();
  const { topAuthors, isLoading: isTopAuthorsLoading } = useBlogsTopAuthors();

  const { userData } = useMyProfile();

  const filtersState = useBlogsFilters();
  const { blogs, cursorRef, isFetchingNextPage, isLoading, hasNextPage } =
    useBlogsInfinite(filtersState.filters);

  const { blogs: recentBlogs, isLoading: isRecentBlogsLoading } =
    useRecentBlogs({
      filters: filtersState.filters,
      enabled: !!userData,
    });

  const localRecentBlogs = useRecentBlogsLocalStorage({ enabled: !userData });

  console.log("isTopAuthorsLoading: " + isTopAuthorsLoading);

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
          recentBlogs={userData ? recentBlogs : localRecentBlogs.blogs}
          isTopBlogsLoading={isTopBlogsLoading}
          isTopAuthorsLoading={isTopAuthorsLoading}
          isRecentBlogsLoading={isRecentBlogsLoading}
        />
      }
    >
      <BlogsListLayoutContent
        viewMode={viewMode}
        enabled={true}
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
