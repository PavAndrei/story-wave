import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ARTICLES: "/articles",
  ARTICLE: "/articles/:articleId",
} as const;

export type PathParams = {
  [ROUTES.ARTICLE]: {
    articleId: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
