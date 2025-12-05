import { authApi } from "@/shared/api/api";
import { ROUTES } from "@/shared/model/routes";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const VerifyEmailPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const hasFetched = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const verify = async () => {
      try {
        const data = await authApi.verifyEmailCode(code || "");

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [code]);

  return (
    <main className="p-10">
      {status === "loading" && <p>Verifying email...</p>}

      {status === "success" && (
        <>
          <h1>Email verified 🎉</h1>
          <button onClick={() => navigate(ROUTES.LOGIN)}>Go to Login</button>
        </>
      )}

      {status === "error" && (
        <>
          <h1>Verification failed</h1>
          <button onClick={() => navigate(ROUTES.HOME)}>Go to Home Page</button>
        </>
      )}
    </main>
  );
};

export const Component = VerifyEmailPage;
