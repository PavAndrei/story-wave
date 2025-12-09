import { AuthLayout } from "./ui/auth-layout";
import { ResetPasswordForm } from "./ui/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <AuthLayout
      title="Reset password"
      description="Enter new password"
      form={<ResetPasswordForm />}
      footerText={
        <span>Your password will be reset after submitting this form</span>
      }
    />
  );
};

export const Component = ResetPasswordPage;
