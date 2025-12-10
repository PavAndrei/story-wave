import { Avatar, AvatarImage } from "@/shared/ui/kit/avatar";
import { FormItem, FormLabel, FormMessage } from "@/shared/ui/kit/form";
import { User, X } from "lucide-react";
import type { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

export const ProfileAvatarInput = ({
  getRootProps,
  getInputProps,
  avatarPreview,
  handleClearAvatar,
}: {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  avatarPreview: string | null;
  handleClearAvatar: () => void;
}) => {
  return (
    <FormItem className="flex flex-col items-center gap-2 relative">
      <FormLabel className="text-slate-700 font-medium text-base">
        Avatar
      </FormLabel>

      <div
        {...getRootProps()}
        className="w-24 h-24 rounded-full border-4 border-cyan-700 shadow-md overflow-hidden cursor-pointer flex items-center justify-center bg-slate-100"
      >
        <input {...getInputProps()} />
        <Avatar className="w-24 h-24 flex items-center justify-center">
          {avatarPreview ? (
            <AvatarImage src={avatarPreview} className="object-cover" />
          ) : (
            <User className="text-cyan-700 size-12" />
          )}
        </Avatar>
      </div>
      <FormMessage />
      {avatarPreview && (
        <button
          type="button"
          aria-label="Clear avatar"
          onClick={(e) => {
            e.stopPropagation();
            handleClearAvatar();
          }}
          className="
              absolute top-7 right-1/3 z-1000
              bg-red-600 text-stale-200 rounded-full p-1
              hover:bg-red-500 active:scale-90
              text-slate-50
              shadow-md cursor-pointer transition-colors duration-200 ease-in-out
            "
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </FormItem>
  );
};
