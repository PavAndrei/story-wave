import "react-router-dom";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_PENDING: "/verify-pending",
  VERIFY: "/verify-email/:code",
  FORGOT_PASSWORD: "/password/forgot",
  RESET_PASSWORD: "/password/reset",
  CREATE_BLOG: "/create-blog/:blogId",
  BLOGS: "/blogs",
  BLOG: "/blog/:blogId",
  MY_BLOGS: "/my-blogs",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  PROFILE_SECURITY: "/profile/security",
  PROFILE_SETTINGS: "/profile/settings",
  PROFILE_CHANGE_PASSWORD: "/profile/change-password",
} as const;

export type PathParams = {
  [ROUTES.BLOG]: {
    blogId: string;
  };
  [ROUTES.CREATE_BLOG]: {
    blogId: string;
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
