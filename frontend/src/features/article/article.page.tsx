import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

const ArticlePage = () => {
  const params = useParams<PathParams[typeof ROUTES.ARTICLE]>();

  return (
    <div>
      <h1>Article Page {params.articleId}</h1>
    </div>
  );
};

export const Component = ArticlePage;
