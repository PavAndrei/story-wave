import { useEffect } from "react";
import { blogApi } from "@/shared/api/api";

export const useAddRecentBlog = (blogId?: string) => {
  useEffect(() => {
    if (!blogId) return;

    blogApi.addToRecentBlogs(blogId).catch(() => {
      // silently ignore
    });
  }, [blogId]);
};
