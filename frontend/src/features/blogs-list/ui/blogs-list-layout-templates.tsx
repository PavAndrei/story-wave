import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { href, Link } from "react-router-dom";

export const BlogsListLayoutTemplates = () => {
  return (
    <div className="flex justify-between gap-2 items-center">
      <p>Start using our amazing markdown editor right now</p>
      <Button
        className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 flex gap-2"
        asChild
      >
        <Link to={href(ROUTES.CREATE_BLOG)}>Create new blog</Link>
      </Button>
    </div>
  );
};
