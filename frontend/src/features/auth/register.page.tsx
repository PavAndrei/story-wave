import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import { Button } from "@/shared/ui/kit/button";

const RegisterPage = () => {
  // const mutation = useMutation({
  //   mutationFn: authApi.register,

  //   onSuccess: (data) => {
  //     console.log("REGISTRATION SUCCESS:", data);
  //   },

  //   onError: (error) => {
  //     console.error("REGISTRATION FAILED:", error);
  //   },
  // });

  const mutation = useMutation({
    mutationFn: () =>
      authApi.register({
        email: "andrpav9@gmail.com",
        password: "123456",
        confirmPassword: "123456",
        username: "andrpav",
      }),

    onSuccess: (data) => {
      console.log("REGISTRATION SUCCESS:", data);
    },

    onError: (error) => {
      console.error("REGISTRATION FAILED:", error);
    },
  });

  return (
    <div>
      Register Page
      <Button onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Loading..." : "Register"}
      </Button>
    </div>
  );
};

export const Component = RegisterPage;
