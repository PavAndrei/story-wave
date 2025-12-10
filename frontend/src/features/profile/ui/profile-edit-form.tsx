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
// import { Spinner } from "@/shared/ui/kit/spinner";
import { Textarea } from "@/shared/ui/kit/textarea"; // ⬅ добавлено
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { href, Link } from "react-router-dom";
import z from "zod";

const EditProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is too short")
    .max(255, "Username is too long"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Incorrect email")
    .max(255, "Email is too long"),

  bio: z.string().max(255, "Bio is too long").optional(),
});

type EditProfileFormValues = z.infer<typeof EditProfileSchema>;

export const ProfileEditForm = () => {
  const { userData } = useMyProfile();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      username: userData?.username || "",
      email: userData?.email || "",
      bio: userData?.bio || "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => console.log(data));

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 max-w-2/3 mx-auto"
        onSubmit={handleSubmit}
        noValidate
      >
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

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Email
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

        {/* {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null} */}

        <div className="flex items-center gap-4 mx-auto">
          <Button
            //   disabled={isPending}
            type="submit"
            aria-label="Edit profile"
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
          >
            {/* {isPending ? <Spinner /> : "Save changes"} */}
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
        </div>
      </form>
    </Form>
  );
};
