import Multiselect from "react-select";
import { Input } from "@/shared/ui/kit/input";
import { categoryOptions } from "@/shared/model/categories";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";

// type Props = {
//   filters: {
//     search: string;
//     author: string;
//     categories: string[];
//     sort: "asc" | "desc";
//   };
//   onChange: (next: Props["filters"]) => void;
// };

export type PublicBlogsFormProps = {
  ui: {
    search: string;
    author: string;
    sort: "newest" | "oldest";
    categories: string[];
  };
  handlers: {
    handleSearchChange: (v: string) => void;
    handleAuthorChange: (v: string) => void;
    handleSortChange: (v: "newest" | "oldest") => void;
    handleCategoriesChange: (v: string[]) => void;
  };
};

export const BlogFilters = ({ ui, handlers }: PublicBlogsFormProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Search by title */}
      <Input
        placeholder="Search by title"
        className="border border-slate-700 placeholder:text-slate-400"
        value={ui.search}
        onChange={(e) => handlers.handleSearchChange(e.target.value)}
      />
      {/* Search by author */}
      <Input
        placeholder="Search by author"
        className="border border-slate-700 placeholder:text-slate-400"
        value={ui.author}
        onChange={(e) => handlers.handleAuthorChange(e.target.value)}
      />

      {/* Categories */}
      <Select
        value={ui.sort}
        onValueChange={(v) =>
          handlers.handleSortChange(v as "newest" | "oldest")
        }
      >
        <SelectTrigger className="w-full border border-slate-700">
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

      {/* Sort */}
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
    </div>
  );
};
