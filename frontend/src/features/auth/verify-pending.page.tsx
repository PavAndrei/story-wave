import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/kit/card";
import { useVerifyAlert } from "./model/use-verify-alert";

export const VerifyPendingPage = () => {
  useVerifyAlert();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 text-slate-700 p-4">
      <Card className="w-full max-w-lg border border-slate-700 shadow-md">
        <CardHeader>
          <CardTitle className="text-cyan-700 text-2xl font-semibold">
            Please verify your email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>We sent a verification link to your email.</p>
          <p>Open the email and click the confirmation link.</p>
          <p>If you did not receive the email, check your spam folder.</p>
          <p>If you have any questions, please contact us.</p>
          <p>You can close this tab for now.</p>

          <p className="pt-4 text-slate-600 text-end">— The StoryWave Team</p>
        </CardContent>
      </Card>
    </main>
  );
};

export const Component = VerifyPendingPage;
