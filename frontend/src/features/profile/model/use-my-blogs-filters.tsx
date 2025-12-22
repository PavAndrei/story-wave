// filters-url.ts
import type { BlogsFilters } from "@/shared/api/api";

export const searchParamsToFilters = (
  params: URLSearchParams,
): BlogsFilters => {
  return {
    status: params.get("status") as BlogsFilters["status"] | undefined,
    sort: (params.get("sort") as "newest" | "oldest") ?? "newest",
    search: params.get("search") ?? "",
    categories: params.get("categories")?.split(",").filter(Boolean) ?? [],
  };
};

export const filtersToSearchParams = (filters: BlogsFilters) => {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }

  return params;
};

// use-my-blogs-filters.ts
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useMyBlogsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔹 filters = всегда из URL
  const filters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams],
  );

  // 🔹 локальный search (для debounce)
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // 🔹 debounce → URL
  useEffect(() => {
    if (debouncedSearch === filters.search) return;

    setSearchParams(
      filtersToSearchParams({
        ...filters,
        search: debouncedSearch,
      }),
      { replace: true },
    );
  }, [debouncedSearch, filters, setSearchParams]);

  // 🔹 универсальный update
  const updateFilters = (patch: Partial<BlogsFilters>) => {
    setSearchParams(
      filtersToSearchParams({
        ...filters,
        ...patch,
      }),
    );
  };

  return {
    filters,

    ui: {
      search: searchInput,
      sort: filters.sort,
      categories: filters.categories,
      statuses: filters.status ? [filters.status] : [],
    },

    handlers: {
      handleSearchChange: setSearchInput,

      handleSortChange: (sort: "newest" | "oldest") => updateFilters({ sort }),

      handleCategoriesChange: (categories: string[]) =>
        updateFilters({ categories }),

      handleStatusesChange: (statuses: string[]) =>
        updateFilters({
          status:
            statuses.length > 0
              ? (statuses[statuses.length - 1] as BlogsFilters["status"])
              : undefined,
        }),
    },
  };
};
