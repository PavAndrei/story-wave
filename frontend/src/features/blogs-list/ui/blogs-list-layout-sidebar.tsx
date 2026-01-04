import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import { BlogFilters, type PublicBlogsFormProps } from "./blogs-filters";
import { History, Rows4, Star } from "lucide-react";

export const BlogsListLayoutSidebar = ({
  filtersState,
}: {
  filtersState: PublicBlogsFormProps;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Tabs
        defaultValue="all"
        className="w-full flex flex-col gap-0 items-center"
      >
        <TabsList className="flex gap-0.5 items-center bg-slate-200">
          <TabsTrigger
            className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-50"
            value="all"
          >
            <Rows4 />
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-50"
            value="favourites"
          >
            <Star />
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer border-slate-700 bg-slate-200 data-[state=active]:bg-slate-50"
            value="recent"
          >
            <History />
          </TabsTrigger>
        </TabsList>
        <TabsContent className="text-sm text-slate-500" value="all">
          All blogs
        </TabsContent>
        <TabsContent className="text-sm text-slate-500" value="favourites">
          Only favourite blogs
        </TabsContent>
        <TabsContent className="text-sm text-slate-500" value="recent">
          Only recent blogs
        </TabsContent>
      </Tabs>
      <BlogFilters {...filtersState} />
    </div>
  );
};
