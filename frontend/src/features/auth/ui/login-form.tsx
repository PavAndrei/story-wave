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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../model/use-login";
import { Spinner } from "@/shared/ui/kit/spinner";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Incorrect email")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password is too long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, errorMessage, isPending } = useLogin();

  const handleSubmit = form.handleSubmit((data) => login(data));

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium text-base">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  className="border border-slate-700"
                  placeholder="******"
                  autoComplete="current-password"
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
          {isPending ? <Spinner /> : "Log in"}
        </Button>
      </form>
    </Form>
  );
};
