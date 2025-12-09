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
import { Spinner } from "@/shared/ui/kit/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useResetPassword } from "../model/use-reset-password";

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password is too long"),
});

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { resetPassword, isPending, errorMessage } = useResetPassword();

  const handleSubmit = form.handleSubmit((data) => {
    resetPassword({ password: data.password });
  });

  console.log(errorMessage);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                New password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  className="border border-slate-700 placeholder:text-slate-400"
                  placeholder="******"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        <Button
          disabled={isPending}
          type="submit"
          aria-label="Reset password"
          className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
        >
          {isPending ? <Spinner /> : "Set new password"}
        </Button>
      </form>
    </Form>
  );
};
