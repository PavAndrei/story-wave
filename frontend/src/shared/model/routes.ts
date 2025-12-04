import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  EDITOR: "/editor",
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
