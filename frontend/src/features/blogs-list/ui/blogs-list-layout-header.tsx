import { LayoutGrid, LayoutList } from "lucide-react";
import { useState } from "react";

export const BlogsListLayoutHeader = ({
  title,
  description,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
}) => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className="text-slate-700 capitalize text-4xl">{title}</h1>
        <p className="text-slate-700 text-lg">{description}</p>
      </div>
      <button
        className="border p-1.5 self-end border-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 transition-all duration-200 ease-in-out active:scale-95"
        type="button"
        aria-label="toggle view mode"
        onClick={() =>
          setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
        }
      >
        {viewMode === "list" ? <LayoutList /> : <LayoutGrid />}
      </button>
    </div>
  );
};
