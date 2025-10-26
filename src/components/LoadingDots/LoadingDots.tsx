import { twMerge } from 'tailwind-merge';

type LoadingDotsProps = {
  className?: string;
  centered?: boolean;
};

export default function LoadingDots({ className, centered = false }: LoadingDotsProps) {
  const dots = (
    <div className={twMerge('flex items-center justify-center gap-1', className)}>
      <Dot className="[animation-delay:0s]" />
      <Dot className="[animation-delay:0.3s]" />
      <Dot className="[animation-delay:0.6s]" />
    </div>
  );

  if (centered) {
    return (
      <div className="flex-1 flex justify-center items-center h-full w-full">
        {dots}
      </div>
    );
  }

  return dots;
}

const Dot = ({ className }: { className: string }) => (
  <div className={twMerge('opacity-30 animate-dot-pulse', className)}>
    <svg width="8px" height="8px" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  </div>
);
