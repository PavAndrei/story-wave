export const BlogListLayout = ({
  header,
  filters,
  children,
  sidebar,
  templates,
}: {
  header: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  templates?: React.ReactNode;
}) => {
  return (
    <div className="container mx-auto">
      <div className="flex gap-4">
        {sidebar}
        <div className="flex-1  p-4 flex flex-col gap-6">
          {templates && (
            <div className="rounded-md bg-gray-100 p-4">{templates}</div>
          )}
          {header}
          {filters}
          {children}
        </div>
      </div>
    </div>
  );
};
