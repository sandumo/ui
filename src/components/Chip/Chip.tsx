import { twMerge } from 'tailwind-merge';

type ChipProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export default function Chip({ children, className, icon, size = 'md', ...props }: ChipProps) {
  return (
    <div
      className={twMerge(
        'flex bg-gray-100 rounded-full border border-gray-200',
        size === 'sm' && 'px-1.5 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-2 text-lg',
        className,
      )}
      {...props}
    >
      {icon && <div className="mr-2 -ml-2">{icon}</div>}
      <div>{children}</div>
    </div>
  );
}
