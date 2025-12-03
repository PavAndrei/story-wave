import { ROUTES } from "@/shared/model/routes";
import { Link, href } from "react-router-dom";

const ArticleListPage = () => {
  return (
    <div>
      <h1>Article List Page</h1>

      <Link to={href(ROUTES.ARTICLE, { articleId: "1" })}>Article 1</Link>
    </div>
  );
};

export const Component = ArticleListPage;
