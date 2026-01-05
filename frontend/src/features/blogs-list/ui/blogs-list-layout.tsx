import clsx from "clsx";

export const BlogListLayout = ({
  header,
  children,
  sidebar,
  templates,
  discoveryColumn,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  templates?: React.ReactNode;
  discoveryColumn?: React.ReactNode;
}) => {
  return (
    <main className="mx-auto my-0 max-w-[1460px] px-2.5 py-10 w-full">
      <div className="flex gap-2 w-full">
        <aside className="w-1/6 bg-slate-200 border border-slate-700 rounded-lg">
          {sidebar}
        </aside>
        <div
          className={clsx(
            `flex-1 flex flex-col gap-6 "${discoveryColumn ? "w-2/3" : "w-5/6"}`,
          )}
        >
          {templates && (
            <div className="rounded-md bg-slate-200 p-4 border border-slate-700">
              {templates}
            </div>
          )}
          {header}
          {children}
        </div>
        {discoveryColumn && <div className="w-1/6">{discoveryColumn}</div>}
      </div>
    </main>
  );
};
