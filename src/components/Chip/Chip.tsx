type ChipProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export default function Chip({ children, className, icon, ...props }: ChipProps) {
  return (
    <div className={`flex bg-gray-100 rounded-full px-3 py-1 border border-gray-200 ${className}`} {...props}>
      {icon && <div className="mr-2 -ml-2">{icon}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
