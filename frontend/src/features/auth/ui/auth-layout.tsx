import { ROUTES } from "@/shared/model/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/kit/card";
import { href, Link } from "react-router-dom";

export const AuthLayout = ({
  form,
  title,
  description,
  footerText,
}: {
  form: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  footerText: React.ReactNode;
}) => {
  return (
    <main className="grow flex flex-col items-center pt-[150px] pb-20 container mx-auto">
      <Card className="w-full max-w-[450px] bg-slate-200 flex flex-col gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
        <CardHeader className="flex flex-col">
          <CardTitle className="text-slate-700 capitalize text-4xl">
            {title}
          </CardTitle>
          <CardDescription className="text-slate-700 text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{form}</CardContent>
        <CardFooter className="flex flex-col gap-2 items-start">
          <p className="text-sm text-slate-700 opacity-90 [&_a]:text-base [&_a]:underline [&_a]:text-cyan-700 [&_a]:hover:text-cyan-600 transition-colors duration-200 ease-in">
            {footerText}
          </p>
          <p className="text-sm text-slate-700 opacity-90 [&_a]:text-base [&_a]:underline [&_a]:text-cyan-700 [&_a]:hover:text-cyan-600 transition-colors duration-200 ease-in">
            Return to
            <Link to={href(ROUTES.HOME)}> Home page</Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};
