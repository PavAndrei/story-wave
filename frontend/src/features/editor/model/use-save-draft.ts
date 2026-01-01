import { blogApi } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";

type SaveDraftArgs = {
  blogId?: string;
  status: "draft" | "published";
  title?: string;
  content?: string;
  categories?: string[];
  coverImgUrl?: string | null;
};

export const useSaveDraft = () => {
  const mutation = useMutation({
    mutationFn: blogApi.saveBlog,
  });

  const saveDraftFunction = async (data: SaveDraftArgs) => {
    const result = await mutation.mutateAsync(data);

    return result.blog;
  };

  return {
    saveDraftFunction,
    isPending: mutation.isPending,
  };
};
