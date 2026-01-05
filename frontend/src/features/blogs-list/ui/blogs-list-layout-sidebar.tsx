import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { BlogFilters, type PublicBlogsFormProps } from "./blogs-filters";
import { History, Rows4, Star } from "lucide-react";
import { href, Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";

export const BlogsListLayoutSidebar = ({
  filtersState,
  enableFilters = true,
  total,
}: {
  filtersState: PublicBlogsFormProps;
  enableFilters: boolean;
  total?: number;
}) => {
  const location = useLocation();

  const value =
    location.pathname === ROUTES.BLOGS_FAVORITES
      ? "favorites"
      : location.pathname === ROUTES.BLOGS_RECENT
        ? "recent"
        : "all";

  return (
    <div className="flex flex-col gap-2">
      <Tabs value={value} className="w-full flex flex-col gap-0 items-center">
        <TabsList className="flex gap-0.5 items-center bg-slate-200">
          <Link to={href(ROUTES.BLOGS)}>
            <TabsTrigger
              className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-50 data-[state=active]:*:[svg]:stroke-cyan-600 data-[state=active]:*:[svg]:fill-yellow-500"
              value="all"
            >
              <Rows4 />
            </TabsTrigger>
          </Link>
          <Link to={href(ROUTES.BLOGS_FAVORITES)}>
            <TabsTrigger
              className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-200 data-[state=active]:*:[svg]:fill-yellow-500 data-[state=active]:*:[svg]:stroke-cyan-600"
              value="favorites"
            >
              <Star />
            </TabsTrigger>
          </Link>
          <Link to={href(ROUTES.BLOGS_RECENT)}>
            <TabsTrigger
              className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-50"
              value="recent"
            >
              <History />
            </TabsTrigger>
          </Link>
        </TabsList>
        <TabsContent className="text-sm text-slate-500" value="all">
          All blogs
        </TabsContent>
        <TabsContent className="text-sm text-slate-500 px-2" value="favorites">
          <p>Favourite blogs</p>
          <p>
            Your favorite blogs are saved here. Mark articles with a star to
            quickly return to them later.
          </p>
          {total && (
            <p>
              Total: <span className="font-semibold">{total}</span>
            </p>
          )}
        </TabsContent>
        <TabsContent className="text-sm text-slate-500" value="recent">
          Only recent blogs
        </TabsContent>
      </Tabs>
      {enableFilters && (
        <BlogFilters ui={filtersState.ui} handlers={filtersState.handlers} />
      )}
    </div>
  );
};
