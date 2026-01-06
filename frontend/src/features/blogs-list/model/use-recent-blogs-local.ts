import { useCallback, useState } from "react";

export type RecentBlogLS = {
  id: string;
  title: string;
  excerpt?: string;
  coverImgUrl?: string;
  createdAt?: string;
  visitedAt: string;
};

type Options = {
  enabled?: boolean;
};

const RECENT_BLOGS_KEY = "recent_blogs";

const readInitialState = (): RecentBlogLS[] => {
  try {
    const raw = localStorage.getItem(RECENT_BLOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useRecentBlogsLocalStorage = (options: Options = {}) => {
  const { enabled = true } = options;

  const [blogs, setBlogs] = useState<RecentBlogLS[]>(
    enabled ? readInitialState : [],
  );

  const refresh = useCallback(() => {
    if (!enabled) return;

    try {
      const raw = localStorage.getItem(RECENT_BLOGS_KEY);
      setBlogs(raw ? JSON.parse(raw) : []);
    } catch {
      setBlogs([]);
    }
  }, [enabled]);

  const clear = useCallback(() => {
    if (!enabled) return;

    localStorage.removeItem(RECENT_BLOGS_KEY);
    setBlogs([]);
  }, [enabled]);

  return {
    blogs,
    refresh,
    clear,
  };
};
