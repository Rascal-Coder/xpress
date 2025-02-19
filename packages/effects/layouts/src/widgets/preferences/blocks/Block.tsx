export const Block = ({
  title,
  children,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <div className="flex flex-col py-4">
      <h3 className="mb-3 font-semibold leading-none tracking-tight">
        {title}
      </h3>
      {children}
    </div>
  );
};
