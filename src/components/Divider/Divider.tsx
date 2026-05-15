import { twMerge } from 'tailwind-merge';

type DividerProps = {
  label?: string;
  className?: string;
  vertical?: boolean;
}

export default function Divider({ label, className, vertical = false }: DividerProps) {
  if (!label) {
    return <div className={twMerge('bg-divider', vertical ? 'w-[1px] h-full' : 'w-full h-[1px]', className)} />;
  }

  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      <div className={twMerge('bg-divider flex-1', vertical ? 'w-[1px] h-full' : 'w-full h-[1px]')} />
      {label && <div className="text-sm">{label}</div>}
      <div className={twMerge('bg-divider flex-1', vertical ? 'w-[1px] h-full' : 'w-full h-[1px]')} />
    </div>
  );
}
