import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { useVerifyEmail } from "./model/use-verify-email";

const VerifyEmailPage = () => {
  const { isPending, isError } = useVerifyEmail();

  if (isPending) return <p>Verifying your email...</p>;

  if (isError)
    return (
      <div>
        <h1>Verification failed</h1>
        <p>The link is invalid or expired.</p>
        <Link to={href(ROUTES.LOGIN)}>Go to Log In Page</Link>
      </div>
    );

  return null;
};

export const Component = VerifyEmailPage;
