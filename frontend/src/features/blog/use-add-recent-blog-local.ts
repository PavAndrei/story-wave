import type { Blog } from "@/shared/api/api";
import { useEffect } from "react";

export type RecentBlogLS = Blog & { visitedAt: string };

type Options = {
  enabled?: boolean;
  limit?: number;
};

const RECENT_BLOGS_KEY = "recent_blogs";

export const useAddRecentBlogLocalStorage = ({
  blog,
  options,
}: {
  blog: Omit<RecentBlogLS, "visitedAt"> | null;
  options?: Options;
}) => {
  const { enabled = true, limit = 20 } = options ?? {};

  useEffect(() => {
    if (!enabled || !blog) return;

    try {
      const raw = localStorage.getItem(RECENT_BLOGS_KEY);
      const list: RecentBlogLS[] = raw ? JSON.parse(raw) : [];

      // удаляем дубликат
      const filtered = list.filter((item) => item._id !== blog._id);

      const next: RecentBlogLS[] = [
        {
          ...blog,
          visitedAt: new Date().toISOString(),
        },
        ...filtered,
      ];

      // если превышен лимит — удаляем последний
      if (next.length > limit) {
        next.length = limit;
      }

      localStorage.setItem(RECENT_BLOGS_KEY, JSON.stringify(next));
    } catch {
      // intentionally empty
    }
  }, [blog?._id, enabled, limit]);
};
