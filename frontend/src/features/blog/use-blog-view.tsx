import { useEffect, useRef } from "react";
import { blogApi } from "@/shared/api/api";

const VIEW_KEY_PREFIX = "viewed_blog_";

export const useBlogView = (blogId?: string) => {
  const hasViewedRef = useRef(false);

  useEffect(() => {
    if (!blogId || hasViewedRef.current) return;

    const key = `${VIEW_KEY_PREFIX}${blogId}`;

    if (sessionStorage.getItem(key)) {
      hasViewedRef.current = true;
      return;
    }

    hasViewedRef.current = true;
    sessionStorage.setItem(key, "1");

    blogApi.registerView(blogId);
  }, [blogId]);
};
