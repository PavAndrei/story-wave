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
import { useForgotPassword } from "../model/use-forgot-password";
import { toast } from "sonner";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Incorrect email")
    .max(255, "Email is too long"),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { forgotPassword, isPending, errorMessage } = useForgotPassword();

  const handleSubmit = form.handleSubmit((data) => {
    forgotPassword(data);
    toast.success("Check your email", {
      duration: 5000,
      classNames: { content: "text-slate-700", icon: "text-cyan-700" },
    });
    form.reset();
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
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
                  className="border border-slate-700 placeholder:text-slate-400"
                  placeholder="user@gmail.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}

        <Button
          disabled={isPending}
          type="submit"
          aria-label="Log in"
          className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
        >
          {isPending ? <Spinner /> : "Send Email"}
        </Button>
      </form>
    </Form>
  );
};
