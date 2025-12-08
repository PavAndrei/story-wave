import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { sessions, isLoading, isError } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-md">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
          <h1 className="text-xl font-semibold text-slate-800">
            Verifying if you have access...
          </h1>
          <p className="text-slate-500 text-center max-w-sm">
            Please wait a moment while we confirm your access.
          </p>
        </div>
      </div>
    );
  }

  if (isError || !sessions) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
