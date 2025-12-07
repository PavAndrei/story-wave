// import { href, Link } from "react-router-dom";
// import { ROUTES } from "@/shared/model/routes";
// import { useVerifyEmail } from "./model/use-verify-email";

// const VerifyEmailPage = () => {
//   const { isPending, isError } = useVerifyEmail();

//   if (isPending) return <p>Verifying your email...</p>;

//   if (isError)
//     return (
//       <div>
//         <h1>Verification failed</h1>
//         <p>The link is invalid or expired.</p>
//         <Link to={href(ROUTES.LOGIN)}>Go to Log In Page</Link>
//       </div>
//     );

//   return null;
// };

// export const Component = VerifyEmailPage;

import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { useVerifyEmail } from "./model/use-verify-email";
import { AlertCircle, Loader2, BadgeCheck } from "lucide-react";

const VerifyEmailPage = () => {
  const { isPending, isError } = useVerifyEmail();

  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-md">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
          <h1 className="text-xl font-semibold text-slate-800">
            Verifying your email...
          </h1>
          <p className="text-slate-500 text-center max-w-sm">
            Please wait a moment while we confirm your email address.
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col gap-4 p-8 rounded-2xl bg-white shadow-md max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />

          <h1 className="text-2xl font-bold text-slate-800">
            Verification failed
          </h1>

          <p className="text-slate-500">
            The link you used is invalid or expired. Please try sending a new
            verification email.
          </p>

          <Link
            className="mt-2 inline-block bg-cyan-600 text-white py-2 px-4 rounded-xl hover:bg-cyan-700 transition"
            to={ROUTES.LOGIN}
          >
            Go to Log In Page
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-md">
        <BadgeCheck className="w-10 h-10 text-green-600" />
        <h1 className="text-2xl font-bold text-slate-800">
          Email verified successfully!
        </h1>
        <Link
          to={ROUTES.HOME}
          className="mt-2 inline-block bg-cyan-600 text-white py-2 px-4 rounded-xl hover:bg-cyan-700 transition"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export const Component = VerifyEmailPage;
