import { useMyBlogsInfinite } from "./model/use-my-blogs-infinity";
import { useMyBlogsFilters } from "./model/use-my-blogs-filters";
import { MyBlogsForm } from "./ui/my-blogs-form";
import { MyBlogsList } from "./ui/my-blogs-list";
import { ProfileLayout } from "./ui/profile-layout";

const MyBlogsListPage = () => {
  const filtersState = useMyBlogsFilters();
  const { blogs, cursorRef, isFetchingNextPage, isLoading } =
    useMyBlogsInfinite(filtersState.filters);

  return (
    <ProfileLayout
      title="My Blogs"
      description="List of your blogs"
      header={<MyBlogsForm {...filtersState} />}
      content={
        <>
          <MyBlogsList
            blogs={blogs}
            isFetchingNextPage={isFetchingNextPage}
            isLoading={isLoading}
          />
          <div ref={cursorRef} className="h-10" />
        </>
      }
      footerText={<></>}
    />
  );
};

export const Component = MyBlogsListPage;
