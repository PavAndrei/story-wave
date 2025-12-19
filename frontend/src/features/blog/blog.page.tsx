import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const params = useParams<PathParams[typeof ROUTES.BLOG]>();

  return (
    <div>
      <h1>Blog Page {params.blogId}</h1>
    </div>
  );
};

export const Component = BlogPage;
