import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";

export const CtaSection = () => {
  return (
    <section className="w-full border-t bg-slate-50">
      <div className="mx-auto max-w-[1460px] px-4 py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Title */}
          <h2 className="text-3xl font-semibold">
            Start writing and sharing your ideas today
          </h2>

          {/* Subtitle */}
          <p className="max-w-xl text-slate-600">
            Join a growing community of writers and readers using Markdown to
            create and explore meaningful content.
          </p>

          {/* Actions */}
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              asChild
              className="bg-cyan-700 px-6 py-2 text-base font-medium text-white hover:bg-cyan-600 active:scale-95"
            >
              <Link to={ROUTES.REGISTER}>Get started for free</Link>
            </Button>

            <Link
              to={ROUTES.BLOGS}
              className="text-sm font-medium text-cyan-700 hover:underline"
            >
              Explore trending posts
            </Link>
          </div>

          {/* Micro text */}
          <p className="text-xs text-slate-500">
            No credit card required. Write your first post in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};
