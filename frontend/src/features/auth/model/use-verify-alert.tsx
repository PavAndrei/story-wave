import { useEffect } from "react";
import { toast } from "sonner";
import { BadgeInfo } from "lucide-react";

export const useVerifyAlert = () => {
  useEffect(() => {
    const id = setTimeout(() => {
      toast(
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <BadgeInfo className="text-cyan-700" />
            <p className="font-semibold text-cyan-700">
              Please verify your email
            </p>
          </div>
          <p className="text-slate-600 text-sm">Check your inbox.</p>
        </div>,
        {
          duration: 2500,
          className:
            "bg-white border border-slate-700 shadow-lg p-4 rounded-md",
        },
      );
    }, 600);

    return () => clearTimeout(id);
  }, []);
};
