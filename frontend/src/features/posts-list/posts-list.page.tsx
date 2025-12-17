import { ROUTES } from "@/shared/model/routes";
import { Link, href } from "react-router-dom";

const ArticleListPage = () => {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["articles", "list"],
  //   queryFn: () => apiInstance("https://jsonplaceholder.typicode.com/todos/1"),
  // });

  return (
    <div>
      <h1>Post List Page</h1>

      <Link to={href(ROUTES.POST, { postId: "1" })}>Post 1</Link>
    </div>
  );
};

export const Component = ArticleListPage;
