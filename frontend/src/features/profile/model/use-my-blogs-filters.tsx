import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useEffect, useState } from "react";
import type { BlogsFilters } from "../my-blogs-list.page";
import { useSearchParams } from "react-router-dom";

export const filtersToSearchParams = (filters: BlogsFilters) => {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.search.trim()) params.set("search", filters.search.trim());

  if (filters.categories.length) {
    params.set("categories", filters.categories.join(","));
  }

  return params;
};

export const searchParamsToFilters = (
  params: URLSearchParams,
): BlogsFilters => {
  return {
    status: (params.get("status") as BlogsFilters["status"]) ?? undefined,
    sort: (params.get("sort") as "newest" | "oldest") ?? "newest",
    search: params.get("search") ?? "",
    categories: params.get("categories")?.split(",") ?? [],
  };
};

export const useMyBlogsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔹 1. Инициализация ОДИН РАЗ
  const [filters, setFilters] = useState<BlogsFilters>(() =>
    searchParamsToFilters(searchParams),
  );

  // 🔹 2. Синхронизация state → URL
  useEffect(() => {
    const params = filtersToSearchParams(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const debouncedSearch = useDebounce(filters.search, 400);

  const debouncedFilters = {
    ...filters,
    search: debouncedSearch,
  };
  // 🔹 3. Handlers
  return {
    filters,
    apiFilters: debouncedFilters,

    ui: {
      search: filters.search,
      sort: filters.sort,
      categories: filters.categories,
      statuses: filters.status ? [filters.status] : [],
    },

    handlers: {
      handleSearchChange: (search: string) =>
        setFilters((f) => ({ ...f, search })),

      handleSortChange: (sort: "newest" | "oldest") =>
        setFilters((f) => ({ ...f, sort })),

      handleCategoriesChange: (categories: string[]) =>
        setFilters((f) => ({ ...f, categories })),

      handleStatusesChange: (statuses: string[]) =>
        setFilters((f) => ({
          ...f,
          status:
            statuses.length === 1
              ? (statuses[0] as BlogsFilters["status"])
              : undefined,
        })),
    },
  };
};
