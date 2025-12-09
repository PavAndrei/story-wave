import { href, Link } from "react-router-dom";
import { AuthLayout } from "./ui/auth-layout";
import { ForgotPasswordForm } from "./ui/forgot-password-form";
import { ROUTES } from "@/shared/model/routes";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout
      title="Forgot password?"
      description="You can reset it here"
      form={<ForgotPasswordForm />}
      footerText={
        <>
          <p>
            We will send you an email to reset your password right after you
            submit this form.
          </p>
          <br />
          <Link to={href(ROUTES.LOGIN)}>Get back to log in</Link>
        </>
      }
    />
  );
};

export const Component = ForgotPasswordPage;
