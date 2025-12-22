import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useParams } from "react-router-dom";

import { Button } from "@/shared/ui/kit/button";
import {
  ArrowLeft,
  Badge,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  Folder,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Blog } from "@/shared/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { formatDate } from "@/shared/model/date";
import { Separator } from "@/shared/ui/kit/separator";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";

const BlogPage = () => {
  const params = useParams<PathParams[typeof ROUTES.BLOG]>();

  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    fetch(`http://localhost:4004/blog/${params.blogId}`)
      .then((res) => res.json())
      .then((data) => setBlog(data));
  }, []);

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Статья не найдена
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Запрашиваемая статья не существует или была удалена.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Шапка статьи */}
      <div className="relative">
        {blog.coverImgUrl && (
          <div className="absolute inset-0 h-96">
            <img
              src={blog.coverImgUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
          </div>
        )}

        <div className="container relative mx-auto px-4 pt-32 pb-16 max-w-6xl">
          <Button
            variant="ghost"
            className="mb-8 text-slate-200 hover:text-white hover:bg-white/20"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge>{blog.status}</Badge>
            {blog?.categories?.map((category) => (
              <Badge
                key={category}
                className="bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20"
              >
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorId}`}
                />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Автор ID: {blog.authorId}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <time>{formatDate(blog.createdAt)}</time>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {/* <span>{readingTime} мин. чтения</span> */}
              <span>{10} мин. чтения</span>
            </div>

            {blog.updatedAt > blog.createdAt && (
              <div className="text-sm text-slate-300">
                Обновлено: {formatDate(blog.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Боковая панель */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Информация
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Статус
                  </span>
                  <Badge>{blog.status}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Категории
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {blog?.categories?.length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Просмотры
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Нет данных
                  </span>
                </div>
              </div>
            </div>

            {blog?.categories?.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Категории
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog?.categories?.map((category) => (
                    <Badge
                      key={category}
                      className="border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* {blog.imagesUrls.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-slate-200">
                  Галерея
                </h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {blog.imagesUrls.map((url, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )} */}
          </aside>

          {/* Контент статьи */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-slate-50 dark:bg-slate-800/50 p-0">
                  <TabsTrigger
                    value="content"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Содержание
                  </TabsTrigger>
                  <TabsTrigger
                    value="raw"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Исходный текст
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="p-0">
                  <article className="prose prose-lg dark:prose-invert max-w-none p-8">
                    <ReactMarkdown
                    // remarkPlugins={[remarkGfm]}
                    // components={{
                    //   code({ node, inline, className, children, ...props }) {
                    //     const match = /language-(\w+)/.exec(className || "");
                    //     return !inline && match ? (
                    //       <SyntaxHighlighter
                    //         style={vscDarkPlus}
                    //         language={match[1]}
                    //         PreTag="div"
                    //         className="rounded-lg !my-4"
                    //         {...props}
                    //       >
                    //         {String(children).replace(/\n$/, "")}
                    //       </SyntaxHighlighter>
                    //     ) : (
                    //       <code
                    //         className={`${className} bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm`}
                    //         {...props}
                    //       >
                    //         {children}
                    //       </code>
                    //     );
                    //   },
                    //   h1: ({ children }) => (
                    //     <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    //       {children}
                    //     </h1>
                    //   ),
                    //   h2: ({ children }) => (
                    //     <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                    //       {children}
                    //     </h2>
                    //   ),
                    //   h3: ({ children }) => (
                    //     <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mt-4 mb-2">
                    //       {children}
                    //     </h3>
                    //   ),
                    //   blockquote: ({ children }) => (
                    //     <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4">
                    //       {children}
                    //     </blockquote>
                    //   ),
                    //   a: ({ children, href }) => (
                    //     <a
                    //       href={href}
                    //       className="text-cyan-600 dark:text-cyan-400 hover:underline hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                    //       target="_blank"
                    //       rel="noopener noreferrer"
                    //     >
                    //       {children}
                    //     </a>
                    //   ),
                    //   ul: ({ children }) => (
                    //     <ul className="list-disc pl-6 my-4 space-y-2">
                    //       {children}
                    //     </ul>
                    //   ),
                    //   ol: ({ children }) => (
                    //     <ol className="list-decimal pl-6 my-4 space-y-2">
                    //       {children}
                    //     </ol>
                    //   ),
                    // }}
                    >
                      {blog.content}
                    </ReactMarkdown>
                  </article>
                </TabsContent>

                <TabsContent value="raw" className="p-0">
                  <div className="p-8">
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      {blog.content}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Мета-информация внизу */}
            <div className="mt-8 flex flex-wrap items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <div>Создано: {formatDate(blog.createdAt)}</div>
                {blog.updatedAt > blog.createdAt && (
                  <div>Обновлено: {formatDate(blog.updatedAt)}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className="text-xs">ID: {blog._id}</Badge>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export const Component = BlogPage;
