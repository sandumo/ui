import clsx from 'clsx';
import { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

type PopoverProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  rootClassName?: string;
  placement?: Placement;
  offset?: number;
}

export default function Popover({ anchorEl, open, onClose, children, className, rootClassName, placement = 'bottom', offset = 8 }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [isOpen2, setIsOpen2] = useState(open);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (open) {
      setIsOpen(true);
      setIsOpen2(true);
      setIsPositioned(false); // Reset positioning state when opening
      isClosingRef.current = false;
    } else {
      if (isOpen || isOpen2) {
        setIsOpen(false);
        setTimeout(() => {
          setIsOpen2(false);
          setIsPositioned(false);
        }, 270);
      }
    }
  }, [open, isOpen, isOpen2]);

  useEffect(() => {
    if (!anchorEl || !contentRef.current || !isOpen2) return;

    let rafId: number;
    let hasPositioned = false;

    const updatePosition = () => {
      if (!contentRef.current || !anchorEl) return;

      const anchorRect = anchorEl.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      // Skip if content hasn't been measured yet
      if (contentRect.height === 0 || contentRect.width === 0) {
        rafId = requestAnimationFrame(updatePosition);
        return;
      }

      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      let top = 0;
      let left = 0;
      let finalPlacement = placement;

      // Calculate base position based on placement
      const calculatePosition = (p: Placement) => {
        let t = 0;
        let l = 0;

        switch (p) {
        case 'top':
          t = anchorRect.top - contentRect.height - offset;
          l = anchorRect.left + anchorRect.width / 2 - contentRect.width / 2;
          break;
        case 'top-start':
          t = anchorRect.top - contentRect.height - offset;
          l = anchorRect.left;
          break;
        case 'top-end':
          t = anchorRect.top - contentRect.height - offset;
          l = anchorRect.right - contentRect.width;
          break;
        case 'bottom':
          t = anchorRect.bottom + offset;
          l = anchorRect.left + anchorRect.width / 2 - contentRect.width / 2;
          break;
        case 'bottom-start':
          t = anchorRect.bottom + offset;
          l = anchorRect.left;
          break;
        case 'bottom-end':
          t = anchorRect.bottom + offset;
          l = anchorRect.right - contentRect.width;
          break;
        case 'left':
          t = anchorRect.top + anchorRect.height / 2 - contentRect.height / 2;
          l = anchorRect.left - contentRect.width - offset;
          break;
        case 'left-start':
          t = anchorRect.top;
          l = anchorRect.left - contentRect.width - offset;
          break;
        case 'left-end':
          t = anchorRect.bottom - contentRect.height;
          l = anchorRect.left - contentRect.width - offset;
          break;
        case 'right':
          t = anchorRect.top + anchorRect.height / 2 - contentRect.height / 2;
          l = anchorRect.right + offset;
          break;
        case 'right-start':
          t = anchorRect.top;
          l = anchorRect.right + offset;
          break;
        case 'right-end':
          t = anchorRect.bottom - contentRect.height;
          l = anchorRect.right + offset;
          break;
        }

        return { t, l };
      };

      // Try original placement
      const pos = calculatePosition(placement);
      top = pos.t;
      left = pos.l;

      // Smart vertical placement flipping for bottom/top placements
      const margin = 8;
      if (placement === 'bottom' || placement === 'bottom-start' || placement === 'bottom-end') {
        // Check if it doesn't fit below
        if (top + contentRect.height > viewport.height - margin) {
          // Try flipping to top
          const topVariant = placement.replace('bottom', 'top') as Placement;
          const topPos = calculatePosition(topVariant);
          const wouldOverlap = (topPos.t + contentRect.height) > anchorRect.top;

          // ALWAYS flip to top if current bottom position doesn't fit
          // and top position won't overlap the anchor
          // This prevents the popover from covering the target element
          if (!wouldOverlap) {
            finalPlacement = topVariant;
            top = topPos.t;
            left = topPos.l;
          }
          // If both positions would cause issues, choose based on available space
          else {
            const spaceAbove = anchorRect.top - margin;
            const spaceBelow = viewport.height - anchorRect.bottom - margin;
            if (spaceAbove >= contentRect.height) {
              // Enough space above, position it there even if it overlaps
              // The final safety check will adjust it
              finalPlacement = topVariant;
              top = topPos.t;
              left = topPos.l;
            }
          }
        }
      } else if (placement === 'top' || placement === 'top-start' || placement === 'top-end') {
        // Check if it doesn't fit above
        if (top < margin) {
          // Try flipping to bottom
          const bottomVariant = placement.replace('top', 'bottom') as Placement;
          const bottomPos = calculatePosition(bottomVariant);
          const wouldOverlap = bottomPos.t < anchorRect.bottom;

          // ALWAYS flip to bottom if current top position doesn't fit
          // and bottom position won't overlap the anchor
          if (!wouldOverlap) {
            finalPlacement = bottomVariant;
            top = bottomPos.t;
            left = bottomPos.l;
          }
          // If both positions would cause issues, choose based on available space
          else {
            const spaceAbove = anchorRect.top - margin;
            const spaceBelow = viewport.height - anchorRect.bottom - margin;
            if (spaceBelow >= contentRect.height) {
              // Enough space below, position it there even if it overlaps
              // The final safety check will adjust it
              finalPlacement = bottomVariant;
              top = bottomPos.t;
              left = bottomPos.l;
            }
          }
        }
      }

      // Adjust horizontal position to stay within viewport
      if (left < margin) {
        left = margin;
      } else if (left + contentRect.width > viewport.width - margin) {
        left = viewport.width - contentRect.width - margin;
      }

      // Final check: ensure popover doesn't overlap with anchor
      // This is a safety check in case smart flipping didn't work as expected
      const popoverBottom = top + contentRect.height;

      // Check for actual overlap: popover overlaps anchor if positioned between anchor's top and bottom
      const hasOverlap = (top < anchorRect.bottom && popoverBottom > anchorRect.top);

      if (hasOverlap) {
        // Determine if we should place above or below based on available space
        const spaceAbove = anchorRect.top - margin;
        const spaceBelow = viewport.height - anchorRect.bottom - margin;

        if (spaceAbove >= contentRect.height + offset) {
          // Place above with proper offset - ensure no overlap
          top = anchorRect.top - contentRect.height - offset;
        } else if (spaceBelow >= contentRect.height + offset) {
          // Place below with proper offset - ensure no overlap
          top = anchorRect.bottom + offset;
        } else {
          // Neither position fits perfectly, use the one with more space
          // and ensure proper offset from anchor to prevent overlap
          if (spaceAbove > spaceBelow) {
            top = Math.max(margin, anchorRect.top - contentRect.height - offset);
          } else {
            top = anchorRect.bottom + offset;
          }
        }
      }

      // Convert to absolute positioning (add scroll offset)
      const finalTop = top + scrollY;
      const finalLeft = left + scrollX;

      setPosition({ top: finalTop, left: finalLeft });
      setIsPositioned(true); // Enable animation after positioning
      hasPositioned = true;
    };

    // Use multiple animation frames to ensure DOM is fully laid out
    // This is crucial for correct initial positioning
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        updatePosition();
      });
    });

    // Listen to both resize and scroll events
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true); // Use capture phase to catch all scroll events

    // Also observe content size changes to reposition when content loads/changes
    const resizeObserver = new ResizeObserver(() => {
      // Only update if we've already positioned once
      // This prevents conflicts with initial positioning
      if (hasPositioned) {
        updatePosition();
      }
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      resizeObserver.disconnect();
    };
  }, [anchorEl, isOpen2, placement, offset]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onClose(); // Call immediately, let the useEffect handle animation timing
  }, [onClose]);

  // Handle click outside to close popover
  useEffect(() => {
    if (!isOpen2 || !contentRef.current || !anchorEl) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Prevent multiple close calls
      if (isClosingRef.current) return;

      const target = event.target as Node;

      // Check if click is outside both the popover content and the anchor element
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        !anchorEl.contains(target)
      ) {
        handleClose();
      }
    };

    // Add a small delay before attaching the listener to prevent immediate closing
    // when the popover is opened by a click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100); // Increased from 0 to 100ms for more reliable click handling

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen2, anchorEl, handleClose]);

  if (!isOpen2) return null;

  return ReactDOM.createPortal(
    <div
      ref={contentRef}
      className={clsx(
        'absolute max-w-screen max-h-screen overflow-auto z-10',
        // Only apply animation after position is calculated to avoid measurement issues
        isPositioned && (isOpen ? 'animate-scale-up' : 'animate-scale-down'),
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        // Hide popover until positioned to prevent flash of incorrect position
        opacity: isPositioned ? undefined : 0,
        pointerEvents: isPositioned ? undefined : 'none',
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
