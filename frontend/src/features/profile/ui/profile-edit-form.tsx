import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { Button } from "@/shared/ui/kit/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { Textarea } from "@/shared/ui/kit/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { href, Link } from "react-router-dom";
import z from "zod";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ProfileAvatarInput } from "./profile-avatar-input";

// ------------------ SCHEMA -------------------
const EditProfileSchema = z.object({
  username: z.string().min(1, "Username is too short").max(255),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Incorrect email")
    .max(255),
  bio: z.string().max(255, "Bio is too long").optional(),
  avatar: z
    .any()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Max file size is 5MB",
    )
    .optional(),
});

type EditProfileFormValues = z.infer<typeof EditProfileSchema>;

// ------------------ COMPONENT -------------------
export const ProfileEditForm = () => {
  const { userData } = useMyProfile();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: userData?.username || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
      avatar: null,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log("FORM DATA:", data);
    console.log("AVATAR FILE:", data.avatar);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 1024 * 1024,
    onDrop: (files: File[]) => {
      const file = files[0];
      if (file) {
        form.clearErrors("avatar");
        form.setValue("avatar", file, { shouldValidate: true });
      }
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (!error) return;

      if (error.code === "file-too-large") {
        form.setError("avatar", {
          type: "manual",
          message: "File is too large (max 1MB)",
        });
      } else {
        form.setError("avatar", {
          type: "manual",
          message: "Invalid file",
        });
      }
    },
  });

  const avatarFile = form.watch("avatar");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData?.avatarUrl || null,
  );

  const handleClearAvatar = () => {
    form.setValue("avatar", null, { shouldValidate: true });
    setAvatarPreview(null);
    form.clearErrors("avatar");
  };

  const handleResetForm = () => {
    form.reset();
    setAvatarPreview(userData?.avatarUrl || null);
  };

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(userData?.avatarUrl || null);
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile, userData?.avatarUrl]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 max-w-2/3 mx-auto"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* ---------------- AVATAR UPLOAD ---------------- */}
        <FormField
          name="avatar"
          control={form.control}
          render={() => (
            <ProfileAvatarInput
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              avatarPreview={avatarPreview}
              handleClearAvatar={handleClearAvatar}
            />
          )}
        />

        {/* ---------------- USERNAME ---------------- */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border border-slate-700 placeholder:text-slate-400"
                  placeholder="user"
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------------- EMAIL ---------------- */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Email {"(can't be changed right now)"}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled
                  className="border border-slate-700 placeholder:text-slate-400 disabled:bg-slate-50"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---------------- BIO ---------------- */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => {
            const textAreaValue = form.watch("bio") || "";
            const maxLength = 255;

            return (
              <FormItem className="relative">
                <FormLabel className="text-slate-700 font-medium text-base">
                  Bio
                </FormLabel>

                <FormControl>
                  <Textarea
                    {...field}
                    maxLength={maxLength}
                    placeholder="Tell us about yourself..."
                    autoComplete="bio"
                    className="
                      border border-slate-700
                      placeholder:text-slate-400
                      resize-none
                      overflow-hidden
                      min-h-28
                      max-h-40
                      py-3 px-4
                      leading-relaxed
                    "
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                      field.onChange(e);
                    }}
                  />
                </FormControl>

                <div className="absolute right-1 -bottom-6 text-xs text-slate-500">
                  {textAreaValue.length}/{maxLength}
                </div>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* BUTTONS */}
        <div className="flex items-center gap-4 mx-auto">
          <Button
            type="submit"
            aria-label="Edit profile"
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
          >
            Save changes
          </Button>

          <Button
            asChild
            aria-label="Link to change profile password"
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
          >
            <Link to={href(ROUTES.PROFILE_CHANGE_PASSWORD)}>
              Change password
            </Link>
          </Button>
          <Button
            onClick={() => handleResetForm()}
            type="reset"
            aria-label="Reset form"
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};
