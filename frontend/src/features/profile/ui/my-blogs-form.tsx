import { categoryOptions } from "@/shared/model/categories";
import { Input } from "@/shared/ui/kit/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/kit/toggle-group";
import { BookCheck, FileArchive, NotebookPen } from "lucide-react";
import Multiselect from "react-select";

type MyBlogsFormProps = {
  ui: {
    search: string;
    sort: "newest" | "oldest";
    categories: string[];
    statuses: Array<"draft" | "published" | "archived">;
  };
  handlers: {
    handleSearchChange: (v: string) => void;
    handleSortChange: (v: "newest" | "oldest") => void;
    handleCategoriesChange: (v: string[]) => void;
    handleStatusesChange: (v: string[]) => void;
  };
};

export const MyBlogsForm = ({ ui, handlers }: MyBlogsFormProps) => {
  return (
    <section className="w-full h-full">
      <form className="flex flex-col gap-2">
        {/* Search */}
        <Input
          type="text"
          placeholder="Search for title..."
          value={ui.search}
          onChange={(e) => handlers.handleSearchChange(e.target.value)}
          className="border border-slate-700 placeholder:text-slate-400"
        />

        {/* Sort */}
        <Select
          value={ui.sort}
          onValueChange={(v) =>
            handlers.handleSortChange(v as "newest" | "oldest")
          }
        >
          <SelectTrigger className="w-[180px] border border-slate-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort options</SelectLabel>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Statuses */}
        <ToggleGroup
          type="multiple"
          value={ui.statuses}
          onValueChange={handlers.handleStatusesChange}
        >
          <ToggleGroupItem value="draft">
            <NotebookPen /> Drafts
          </ToggleGroupItem>

          <ToggleGroupItem value="published">
            <BookCheck /> Published
          </ToggleGroupItem>

          <ToggleGroupItem value="archived">
            <FileArchive /> Archived
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Categories */}
        <Multiselect
          isMulti
          options={categoryOptions}
          value={categoryOptions.filter((opt) =>
            ui.categories.includes(opt.value),
          )}
          onChange={(values) =>
            handlers.handleCategoriesChange(values.map((v) => v.value))
          }
        />
      </form>
    </section>
  );
};
