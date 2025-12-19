import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter, redirect } from "react-router-dom";
import { App } from "./app";
import { Providers } from "./providers";
import { ProtectedRoute } from "./protected-route";

export const router = createBrowserRouter([
  {
    element: (
      <Providers>
        <App />
      </Providers>
    ),

    children: [
      {
        Component: ProtectedRoute,
        children: [
          {
            path: ROUTES.CREATE_BLOG,
            lazy: () => import("@/features/editor/create-blog.page"),
          },
          {
            path: ROUTES.MY_BLOGS,
            lazy: () => import("@/features/blogs-list/my-blogs-list.page"),
          },
          {
            path: ROUTES.PROFILE,
            lazy: () => import("@/features/profile/profile.page"),
            children: [
              {
                index: true,
                lazy: () => import("@/features/profile/profile-overview.page"),
              },
              {
                path: ROUTES.PROFILE_EDIT,
                lazy: () => import("@/features/profile/profile-edit.page"),
              },
              {
                path: ROUTES.PROFILE_SETTINGS,
                lazy: () => import("@/features/profile/profile-settings.page"),
              },
              {
                path: ROUTES.PROFILE_SECURITY,
                lazy: () => import("@/features/profile/profile-security.page"),
              },
              {
                path: ROUTES.PROFILE_CHANGE_PASSWORD,
                lazy: () =>
                  import("@/features/profile/profile-change-password.page"),
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.BLOGS,
        lazy: () => import("@/features/blogs-list/blogs-list.page"),
      },
      {
        path: ROUTES.ABOUT,
        lazy: () => import("@/features/about/about.page"),
      },
      {
        path: ROUTES.BLOG,
        lazy: () => import("@/features/blog/blog.page"),
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@/features/auth/login.page"),
      },
      {
        path: ROUTES.REGISTER,
        lazy: () => import("@/features/auth/register.page"),
      },
      {
        path: ROUTES.VERIFY_PENDING,
        lazy: () => import("@/features/auth/verify-pending.page"),
      },
      {
        path: ROUTES.VERIFY,
        lazy: () => import("@/features/auth/verify-email.page"),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        lazy: () => import("@/features/auth/forgot-password.page"),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        lazy: () => import("@/features/auth/reset-password.page"),
      },
      {
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.BLOGS),
      },
    ],
  },
]);
