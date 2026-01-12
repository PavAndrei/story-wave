import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { href, Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="max-w-[1460px] w-full mx-auto my-0 px-2.5">
      <section className="relative flex h-150 overflow-hidden">
        <div className="relative z-10 mt-[10%] flex flex-col gap-5">
          <h1 className="font-black text-4xl flex flex-col gap-3">
            <span>Write. Edit. Publish.</span>
            <span className="font-semibold text-2xl">
              All in one Markdown-powered platform.
            </span>
          </h1>
          <p className="max-w-[350px]">
            A modern blogging platform with a powerful Markdown editor, live
            preview, autosave, and full control over your content.
          </p>
          <Button
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 max-w-[200px] flex gap-2"
            asChild
          >
            <Link to={href(ROUTES.REGISTER)}>Get Started</Link>
          </Button>
        </div>

        <img
          src="./hero-light.png"
          alt="backgorund"
          className="object-contain w-full h-150 absolute top-0 left-35 z-0"
        />
      </section>
    </div>
  );
};
