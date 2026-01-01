import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/ui/kit/card";

export const PostEditorLayout = ({
  title,
  description,
  toolbar,

  content,
  footer,
}: {
  title: React.ReactNode;
  description: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}) => {
  return (
    <main className="max-w-[1440px] mx-auto w-full px-2.5 pt-11">
      <Card className="bg-slate-200 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <h1 className="font-semibold text-4xl capitalize text-slate-700">
            {title}
          </h1>
          <p className="text-slate-700 text-lg">{description}</p>

          {toolbar && <div className="mt-4 flex gap-2">{toolbar}</div>}
        </CardHeader>

        <CardContent className="">{content}</CardContent>
        <CardFooter className="border-t border-slate-700">{footer}</CardFooter>
      </Card>
    </main>
  );
};
