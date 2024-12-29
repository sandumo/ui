import { twMerge } from 'tailwind-merge';

export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1">
      {/* <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0s]" />
      <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0.3s]" />
      <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0.6s]" /> */}
      {/* <svg width="6px" height="6px" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <circle cx="3" cy="3" r="3" fill="currentColor" />
      </svg> */}

      <Dot className="[animation-delay:0s]" />
      <Dot className="[animation-delay:0.3s]" />
      <Dot className="[animation-delay:0.6s]" />
    </div>
  );
}

const Dot = ({ className }: { className: string }) => (
  <div className={twMerge('opacity-30 animate-dot-pulse', className)}>
    <svg width="6px" height="6px" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
      <circle cx="3" cy="3" r="3" fill="currentColor" />
    </svg>
  </div>
);
