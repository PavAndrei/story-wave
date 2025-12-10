import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/ui/kit/card";

export const ProfileLayout = ({
  title,
  description,
  header,
  content,
  footerText,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  header: React.ReactNode;
  content: React.ReactNode;
  footerText: React.ReactNode;
}) => {
  return (
    <main className="w-full max-w-3xl h-full mx-auto py-11 flex flex-col gap-6">
      <Card className="px-2 py-4 bg-slate-200 border-slate-700 text-center">
        <h1 className="text-slate-700 capitalize text-4xl">{title}</h1>
        <p className="text-slate-500 text-lg">{description}</p>
      </Card>

      <Card className="border border-slate-700 shadow-sm rounded-2xl bg-slate-200 flex flex-col gap-8 px-2 py-4">
        <CardHeader className="flex flex-col items-center text-center gap-4">
          {header}
        </CardHeader>
        <CardContent className="text-slate-700 text-sm leading-relaxed">
          {content}
        </CardContent>
        <CardFooter className="flex justify-center pt-6 border-t border-slate-700">
          {footerText}
        </CardFooter>
      </Card>
    </main>
  );
};
