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
        'flex items-center bg-gray-100 rounded-full border border-gray-200',
        size === 'sm' && 'h-6 px-[7px] py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-2 text-lg',
        className,
      )}
      {...props}
    >
      {icon && (
        <div className={twMerge(
          'mr-2 -ml-2',
          size === 'sm' && 'mr-0.5 -ml-0.5 *:!text-[18px]',
          size === 'md' && '*:!text-sm',
          size === 'lg' && '*:!text-lg'
        )}>
          {icon}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
