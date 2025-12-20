import { blogApi, type Blog } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useMyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);

  const myBlogsMutation = useMutation({
    mutationFn: blogApi.getMyBlogs,

    onSuccess: (data) => {
      console.log("CREATE DRAFT SUCCESS:", data);

      if (data.blogs && data.blogs?.length > 0) setMyBlogs(data.blogs);
    },

    onError: (error) => {
      console.error("CREATE DRAFT FAILED:", error.message);
    },
  });

  useEffect(() => {
    myBlogsMutation.mutate();
  }, []);

  const errorMessage = myBlogsMutation.isError
    ? myBlogsMutation.error.message
    : null;

  return {
    fetchMyBlogs: myBlogsMutation.mutate,
    isPending: myBlogsMutation.isPending,
    errorMessage,
    myBlogs,
  };
};
