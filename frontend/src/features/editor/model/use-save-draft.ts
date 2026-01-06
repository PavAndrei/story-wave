import { blogApi } from "@/shared/api/blog-api";
import { useMutation } from "@tanstack/react-query";

import type { SaveBlogPayload } from "@/shared/api/api-types";

export const useSaveDraft = () => {
  const mutation = useMutation({
    mutationFn: blogApi.saveBlog,
  });

  const saveDraftFunction = async (data: SaveBlogPayload) => {
    const result = await mutation.mutateAsync(data);

    return result.blog;
  };

  return {
    saveDraftFunction,
    isPending: mutation.isPending,
  };
};
