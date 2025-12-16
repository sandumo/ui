import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';

type TooltipProps = {
  title?: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showOnMobile?: boolean;
  className?: string;
}

type Placement = 'top' | 'bottom' | 'left' | 'right';

export default function Tooltip({ title, children, placement = 'top', showOnMobile = false, className }: TooltipProps) {
  const [adjustedPlacement, setAdjustedPlacement] = useState<Placement>(placement);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkPlacement = () => {
      if (!tooltipRef.current || !containerRef.current) return;

      const tooltip = tooltipRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let newPlacement = placement;

      // Check if tooltip goes outside viewport and adjust
      if (placement === 'top' && tooltip.top < 0) {
        newPlacement = 'bottom';
      } else if (placement === 'bottom' && tooltip.bottom > viewport.height) {
        newPlacement = 'top';
      } else if (placement === 'left' && tooltip.left < 0) {
        newPlacement = 'right';
      } else if (placement === 'right' && tooltip.right > viewport.width) {
        newPlacement = 'left';
      }

      // Check horizontal overflow for top/bottom placements
      if ((placement === 'top' || placement === 'bottom') && tooltip.left < 0) {
        newPlacement = 'right';
      } else if ((placement === 'top' || placement === 'bottom') && tooltip.right > viewport.width) {
        newPlacement = 'left';
      }

      // Check vertical overflow for left/right placements
      if ((placement === 'left' || placement === 'right') && tooltip.top < 0) {
        newPlacement = 'bottom';
      } else if ((placement === 'left' || placement === 'right') && tooltip.bottom > viewport.height) {
        newPlacement = 'top';
      }

      setAdjustedPlacement(newPlacement);
    };

    const handleMouseEnter = () => {
      // Reset to original placement first
      setAdjustedPlacement(placement);
      // Small delay to let the tooltip render before checking
      setTimeout(checkPlacement, 10);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('scroll', checkPlacement);
      window.addEventListener('resize', checkPlacement);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
      window.removeEventListener('scroll', checkPlacement);
      window.removeEventListener('resize', checkPlacement);
    };
  }, [placement]);

  return (
    <div className={twMerge('relative group', className)} ref={containerRef}>
      <div>{children}</div>

      {title ? (
        <div
          ref={tooltipRef}
          className={twMerge(
            'absolute bg-black/65 text-white rounded-md px-2 py-1.5 shadow-md backdrop-blur-sm',
            'w-max max-w-[200px] text-xs pointer-events-none z-50',
            'opacity-0 transition-opacity duration-100',
            showOnMobile
              ? 'group-hover:opacity-100 group-hover:delay-150 group-active:opacity-100'
              : '[@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:delay-150',
            'before:content-[""] before:absolute before:border-[5px] before:border-transparent',
            (adjustedPlacement === 'top' || adjustedPlacement === 'bottom') && 'left-1/2 -translate-x-1/2 before:left-1/2 before:-translate-x-1/2',
            (adjustedPlacement === 'left' || adjustedPlacement === 'right') && 'top-1/2 -translate-y-1/2 before:top-1/2 before:-translate-y-1/2',
            adjustedPlacement === 'top' && 'bottom-[calc(100%+.5rem)] before:top-full before:border-t-black/65',
            adjustedPlacement === 'bottom' && 'top-[calc(100%+.5rem)] before:bottom-full before:border-b-black/65',
            adjustedPlacement === 'left' && 'right-[calc(100%+.5rem)] before:left-full before:border-l-black/65',
            adjustedPlacement === 'right' && 'left-[calc(100%+.5rem)] before:right-full before:border-r-black/65',
          )}
        >
          {title}
        </div>
      ) : null}
    </div>
  );
}
