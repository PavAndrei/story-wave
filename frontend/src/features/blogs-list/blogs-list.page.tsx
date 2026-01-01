import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Link, href } from "react-router-dom";

const BlogsListPage = () => {
  return (
    <main className="max-w-[1440px] px-2.5 mx-auto flex items-center">
      <div className="flex flex-col self-start">
        <h1>Blog List Page</h1>

        <Button asChild type="button" className="max-w-fit cursor-pointer">
          <Link to={href(ROUTES.CREATE_BLOG)}>Create new Blog</Link>
        </Button>

        <Link to={href(ROUTES.BLOG, { blogId: "1" })}>Blog 1</Link>
      </div>
    </main>
  );
};

export const Component = BlogsListPage;
