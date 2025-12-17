import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

const ArticlePage = () => {
  const params = useParams<PathParams[typeof ROUTES.POST]>();

  return (
    <div>
      <h1>Post Page {params.postId}</h1>
    </div>
  );
};

export const Component = ArticlePage;
