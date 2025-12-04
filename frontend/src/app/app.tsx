import { AppHeader } from "@/features/header";
import { ROUTES } from "@/shared/model/routes";
import { Outlet, useLocation } from "react-router-dom";

export const App = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  return (
    <div className="text-slate-700 dark:text-slate-300">
      {!isAuthPage && <AppHeader />}
      <Outlet />
    </div>
  );
};
