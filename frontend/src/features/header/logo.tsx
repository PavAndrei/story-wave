import { ROUTES } from "@/shared/model/routes";
import { href, Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to={href(ROUTES.HOME)} aria-label="logo">
      <div className="flex cursor-pointer">
        <div className="border border-slate-300 rounded-full flex items-center justify-center bg-cyan-700 font-semibold text-slate-200 tet-base z-1 px-3 py-2">
          Story
        </div>
        <div className="border rounded-full -translate-x-3.5 z-0 flex items-center justify-center bg-slate-200 font-semibold text-cyan-700 tet-base border-cyan-700 px-3 py-2">
          Wave
        </div>
      </div>
    </Link>
  );
};
