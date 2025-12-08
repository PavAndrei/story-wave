import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_PENDING: "/verify-pending",
  VERIFY: "/verify-email/:code",
  EDITOR: "/editor",
  ARTICLES: "/articles",
  ARTICLE: "/articles/:articleId",
  PROFILE: "/profile",
  PROFILE_SECURITY: "/profile/security",
  PROFILE_SETTINGS: "/profile/settings",
} as const;

export type PathParams = {
  [ROUTES.ARTICLE]: {
    articleId: string;
  };
  [ROUTES.VERIFY]: {
    code: string;
  };
};

declare module "react-router-dom" {
  interface Register {
    params: PathParams;
  }
}
