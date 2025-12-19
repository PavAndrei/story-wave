import { postApi } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useCreateDraft = () => {
  const [postId, setPostId] = useState("");

  const saveDraftMutation = useMutation({
    mutationFn: postApi.createDraft,

    onSuccess: (data) => {
      console.log("CREATE DRAFT SUCCESS:", data);
      setPostId(data.data._id);
    },

    onError: (error) => {
      console.error("CREATE DRAFT FAILED:", error.message);
    },
  });

  const errorMessage = saveDraftMutation.isError
    ? saveDraftMutation.error.message
    : null;

  useEffect(() => {
    const getPostId = async () => {
      if (postId) return;

      const post = await saveDraftMutation.mutate();
      console.log(post._id);
    };

    getPostId();
  }, []);

  return {
    saveDraft: saveDraftMutation.mutate,
    isPending: saveDraftMutation.isPending,
    errorMessage,
  };
};
