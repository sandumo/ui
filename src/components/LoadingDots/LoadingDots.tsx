import { twMerge } from 'tailwind-merge';

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1">
      <Dot className="[animation-delay:0s]" />
      <Dot className="[animation-delay:0.3s]" />
      <Dot className="[animation-delay:0.6s]" />
    </div>
  );
}

const Dot = ({ className }: { className: string }) => (
  <div className={twMerge('opacity-30 animate-dot-pulse', className)}>
    <svg width="8px" height="8px" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  </div>
);
