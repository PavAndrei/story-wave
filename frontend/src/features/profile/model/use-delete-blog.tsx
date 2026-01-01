import { blogApi } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";

export const useDeleteBlog = (blogId: string) => {
  const deleteBlogMutation = useMutation({
    mutationFn: () => blogApi.deleteBlogById(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [blogApi.baseKey, "my"] });
    },
    onError: (error) => {
      console.error("Failed to delete blog:", error.message);
    },
  });

  const errorMessage = deleteBlogMutation.isError
    ? deleteBlogMutation.error.message
    : null;

  return {
    deleteBlog: deleteBlogMutation.mutate,
    isDeleting: deleteBlogMutation.isPending,
    errorMessage,
  };
};
