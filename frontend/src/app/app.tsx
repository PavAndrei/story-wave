import { AppHeader } from "@/features/header";
import { ROUTES } from "@/shared/model/routes";
import { Outlet, useLocation } from "react-router-dom";

export const App = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.REGISTER ||
    location.pathname === ROUTES.VERIFY_PENDING ||
    location.pathname.startsWith(ROUTES.VERIFY.replace(":code", ""));

  return (
    <div className="min-h-screen flex flex-col text-slate-700 bg-slate-50 dark:text-slate-300">
      {!isAuthPage && <AppHeader />}
      <Outlet />
    </div>
  );
};
