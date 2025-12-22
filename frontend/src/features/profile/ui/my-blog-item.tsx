import type { Blog } from "@/shared/api/api";
import { formatDate } from "@/shared/model/date";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardHeader, CardFooter } from "@/shared/ui/kit/card";
import { Image } from "lucide-react";
import { href, Link } from "react-router-dom";

export const MyBlogItem = (blog: Blog) => {
  return (
    <li>
      <Card className="border border-slate-700">
        <CardHeader className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {blog.coverImgUrl ? (
              <img
                className="size-14 border-slate-700 border rounded-md"
                src={blog.coverImgUrl || ""}
                alt={blog.title}
              />
            ) : (
              <Image className="size-14 border-slate-700 border rounded-md flex items-center justify-center text-slate-700" />
            )}

            <div>
              <h2 className="text-lg font-medium">
                {blog.title || "Untitled"}
              </h2>
              <p className="text-sm text-slate-500">Status: {blog.status}</p>
            </div>
          </div>
          <div>
            <p>Created at {formatDate(blog.createdAt)}</p>
            <p>
              {blog.updatedAt && `Updated at ${formatDate(blog.updatedAt)}`}
            </p>
          </div>

          <div className="flex gap-2 items-end flex-col">
            <div className="flex gap-2 items-center">
              <Button className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-1 px-3 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2">
                Edit
              </Button>
              <Button className="cursor-pointer bg-red-800 text-slate-200 font-medium text-base py-1 px-3 hover:bg-red-700 active:scale-95 ml-auto mr-0 flex gap-2">
                Delete
              </Button>
            </div>

            {blog.status === "published" && (
              <div className="flex gap-2 items-center">
                <Button className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-1 px-3 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2">
                  Archive
                </Button>
                <Button
                  asChild
                  className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-1 px-3 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2"
                >
                  <Link to={href(ROUTES.BLOG, { blogId: blog._id })}>View</Link>
                </Button>
              </div>
            )}

            {blog.status === "archived" && (
              <div className="flex gap-2 items-center">
                <Button className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-1 px-3 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2">
                  Unarchive
                </Button>
                <Button className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-1 px-3 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2">
                  View
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardFooter>
          {!blog.categories ||
            (blog.categories.length === 0 && <p>No categories added yet</p>)}

          {blog.categories &&
            blog.categories.length > 0 &&
            blog.categories.map((category) => (
              <span
                key={category}
                className="text-sm text-slate-700 px-3 py-1 bg-slate-200 rounded-full"
              >
                {category}
              </span>
            ))}
        </CardFooter>
      </Card>
    </li>
  );
};
