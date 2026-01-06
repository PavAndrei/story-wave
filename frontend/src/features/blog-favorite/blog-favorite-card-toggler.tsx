import { Toggle } from "@radix-ui/react-toggle";
import { Star } from "lucide-react";
import { useToggleFavorite } from "./use-toggle-favorite";
import clsx from "clsx";
import type { BlogDTO } from "@/shared/api/api-types";

export const BlogFavoriteCardToggler = ({
  blog,
  className,
}: {
  blog: BlogDTO;
  className?: string;
}) => {
  const { getFavoritesState, toggle } = useToggleFavorite();

  const { isFavorite } = getFavoritesState(blog);

  return (
    <Toggle
      aria-label="Toggle bookmark"
      pressed={isFavorite}
      onPressedChange={() => toggle(blog)}
      className={clsx(
        "data-[state=on]:bg-slate-200 data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-cyan-600 size-8 absolute top-2 right-2 bg-slate-200 cursor-pointer text-slate-700 hover:bg-slate-200 hover:text-cyan-700 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 ease-in-out active:scale-95 rounded flex justify-center items-center",
        className,
      )}
    >
      <Star />
    </Toggle>
  );
};
