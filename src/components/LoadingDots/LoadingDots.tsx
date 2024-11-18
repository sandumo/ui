export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0s]" />
      <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0.3s]" />
      <div className="w-1.5 h-1.5 bg-white opacity-30 rounded-full animate-dot-pulse [animation-delay:0.6s]" />
    </div>
  );
}
