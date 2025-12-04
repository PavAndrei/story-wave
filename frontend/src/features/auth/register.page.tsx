import { ROUTES } from "@/shared/model/routes";
import { AuthLayout } from "./auth-layout";
import { href, Link } from "react-router-dom";
import { RegisterForm } from "./register-form";

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Registration"
      description="Join us and start writing stories"
      form={<RegisterForm />}
      footerText={
        <>
          <span>Already have an account</span>
          <Link to={href(ROUTES.LOGIN)}>Log in</Link>
        </>
      }
    ></AuthLayout>
  );
};

export const Component = RegisterPage;
