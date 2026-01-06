import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";
import { blogApi } from "@/shared/api/blog-api";

export const useAddRecentBlog = (blogId?: string, enabled = true) => {
  const addToRecentBlogsMutation = useMutation({
    mutationFn: (blogId: string) => blogApi.addToRecentBlogs(blogId),

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [blogApi.baseKey],
      });
    },
  });

  useEffect(() => {
    if (!blogId || !enabled) return;

    addToRecentBlogsMutation.mutate(blogId);
  }, [blogId]);
};
