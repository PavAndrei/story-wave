import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Blog } from "@/shared/api/api";
import { MarkdownRenderer } from "../markdown";

const BlogPage = () => {
  const params = useParams<PathParams[typeof ROUTES.BLOG]>();

  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    fetch(`http://localhost:4004/blog/${params.blogId}`)
      .then((res) => res.json())
      .then((data) => setBlog(data.blog));
  }, []);

  // if (!blog) {
  //   return (
  //     <div className="container mx-auto px-4 py-8 max-w-6xl">
  //       <div className="text-center py-20">
  //         <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
  //           Статья не найдена
  //         </h1>
  //         <p className="text-slate-600 dark:text-slate-400 mb-8">
  //           Запрашиваемая статья не существует или была удалена.
  //         </p>
  //         <Button variant="outline" onClick={() => window.history.back()}>
  //           <ArrowLeft className="mr-2 h-4 w-4" />
  //           Вернуться назад
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="border rounded-md p-3 prose max-w-none overflow-auto">
      <MarkdownRenderer content={blog?.content || ""} onToggleTask={() => {}} />
    </div>
  );
};

export const Component = BlogPage;
