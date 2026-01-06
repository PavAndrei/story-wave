import type { PublicBlogsFilters } from "@/shared/api/api-types";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const searchParamsToFilters = (
  params: URLSearchParams,
): Omit<PublicBlogsFilters, "page" | "limit" | "totalPages" | "total"> => {
  return {
    sort: (params.get("sort") as "newest" | "oldest") ?? "newest",
    author: params.get("author") ?? "",
    search: params.get("search") ?? "",
    categories: params.get("categories")?.split(",").filter(Boolean) ?? [],
  };
};

export const filtersToSearchParams = (
  filters: Omit<PublicBlogsFilters, "page" | "limit" | "totalPages" | "total">,
) => {
  const params = new URLSearchParams();

  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.author.trim()) params.set("author", filters.author.trim());
  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }

  return params;
};

export const useBlogsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams],
  );

  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [authorInput, setAuthorInput] = useState(filters.author);
  const debouncedAuthor = useDebounce(authorInput, 400);

  useEffect(() => {
    const isSearchChanged = debouncedSearch !== filters.search;
    const isAuthorChanged = debouncedAuthor !== filters.author;

    if (!isSearchChanged && !isAuthorChanged) return;

    setSearchParams(
      filtersToSearchParams({
        ...filters,
        search: debouncedSearch,
        author: debouncedAuthor,
      }),
      { replace: true },
    );
  }, [debouncedSearch, debouncedAuthor, filters, setSearchParams]);

  const updateFilters = (
    patch>,
  ) => {
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
      author: authorInput,
      sort: filters.sort,
      categories: filters.categories,
    },

    handlers: {
      handleSearchChange: setSearchInput,
      handleAuthorChange: setAuthorInput,

      handleSortChange: (sort: "newest" | "oldest") => updateFilters({ sort }),

      handleCategoriesChange: (categories: string[]) =>
        updateFilters({ categories }),
    },
  };
};
