import { ROUTES } from "@/shared/model/routes";
import { Link, href } from "react-router-dom";

const ArticleListPage = () => {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["articles", "list"],
  //   queryFn: () => apiInstance("https://jsonplaceholder.typicode.com/todos/1"),
  // });

  // Установить shandcn и tailwind
  // 1 : 29 : 11

  return (
    <div>
      <h1>Article List Page</h1>

      <Link to={href(ROUTES.ARTICLE, { articleId: "1" })}>Article 1</Link>
    </div>
  );
};

export const Component = ArticleListPage;
