import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useState } from "react";

export const useMyBlogsFilters = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<
    Array<"draft" | "published" | "archived">
  >([]);

  const apiFilters = {
    status: statuses.length === 1 ? statuses[0] : undefined,
    sort,
    search: debouncedSearch, // ✅ ТОЛЬКО ТУТ debounce
    categories,
  };

  return {
    filters: apiFilters,
    ui: {
      search, // ✅ UI БЕЗ debounce
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
