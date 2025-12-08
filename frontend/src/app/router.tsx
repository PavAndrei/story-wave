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
            path: ROUTES.EDITOR,
            lazy: () => import("@/features/editor/editor.page"),
          },
          {
            path: ROUTES.PROFILE,
            lazy: () => import("@/features/profile/profile.page"),
            children: [
              {
                index: true,
                lazy: () =>
                  import("@/features/profile/pages/profile-overview.page"),
              },
              {
                path: ROUTES.PROFILE_SETTINGS,
                lazy: () =>
                  import("@/features/profile/pages/profile-settings.page"),
              },
              {
                path: ROUTES.PROFILE_SECURITY,
                lazy: () =>
                  import("@/features/profile/pages/profile-security.page"),
              },
            ],
          },
        ],
      },
      {
        path: ROUTES.ARTICLES,
        lazy: () => import("@/features/articles-list/articles-list.page"),
      },
      {
        path: ROUTES.ABOUT,
        lazy: () => import("@/features/about/about.page"),
      },
      {
        path: ROUTES.ARTICLE,
        lazy: () => import("@/features/article/article.page"),
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
        path: ROUTES.HOME,
        loader: () => redirect(ROUTES.ARTICLES),
      },
    ],
  },
]);
