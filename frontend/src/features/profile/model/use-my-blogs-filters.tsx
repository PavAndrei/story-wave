import { useState } from "react";

export const useMyBlogsFilters = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<
    Array<"draft" | "published" | "archived">
  >([]);

  const apiFilters = {
    status: statuses.length === 1 ? statuses[0] : undefined,
    sort,
    search,
    categories,
  };

  return {
    filters: apiFilters,
    ui: {
      search,
      sort,
      categories,
      statuses,
    },
    handlers: {
      handleSearchChange: setSearch,
      handleSortChange: setSort,
      handleCategoriesChange: setCategories,
      handleStatusesChange: (values: string[]) =>
        setStatuses(values as Array<"draft" | "published" | "archived">),
    },
  };
};
