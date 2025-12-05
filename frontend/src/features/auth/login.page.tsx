import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { AuthLayout } from "./ui/auth-layout";
import { LoginForm } from "./ui/login-form";

const LoginPage = () => {
  return (
    <AuthLayout
      title="Login"
      description="Log in to your account"
      form={<LoginForm />}
      footerText={
        <>
          <span>Don't have an account?</span>
          <Link to={href(ROUTES.REGISTER)}> Sign up</Link>
        </>
      }
    />
  );
};

export const Component = LoginPage;
