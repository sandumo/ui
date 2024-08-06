import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type ZoomInSheet = {
  children?: React.ReactNode;
  triggerElement?: React.ReactNode;
  position?: 'relative' | 'absolute';
  width?: number;
  height?: number;
}

export default function ZoomInSheet({
  children,
  triggerElement,
  position = 'relative',
  width = 250,
  height = 350,
}: ZoomInSheet) {
  const ref = useRef<HTMLDivElement>(null);

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const [open, setOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const trigger = {
    left: ref.current?.offsetLeft || 0,
    top: ref.current?.offsetTop || 0,
    width: ref.current?.offsetWidth || 0,
    height: ref.current?.offsetHeight || 0,
  };

  useEffect(() => {
    // get window width and height
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const translateX = (windowWidth - width) / 2 - trigger.left;
  const translateY = (windowHeight - height) / 2 - trigger.top + scrollTop;

  const transitionDuration = .25;

  function disableScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.documentElement.style.overflow = 'hidden'; // Disabling scroll
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.top = `-${scrollTop}px`;
    document.documentElement.style.width = '100%';
  }

  // Function to enable scroll
  function enableScroll() {
    const scrollTop = parseInt(document.documentElement.style.top);
    document.documentElement.style.overflow = '';
    document.documentElement.style.position = '';
    document.documentElement.style.top = '';
    document.documentElement.style.width = '';
    window.scrollTo(0, -scrollTop); // Scrolls to the original position
  }

  useEffect(() => {
    if (open) {
      disableScroll();
      setTimeout(() => {
        setShowContent(true);
      }, transitionDuration * 1000);
    } else {
      enableScroll();
    }
  }, [open]);

  useEffect(() => {
    if (!showContent) {
      setTimeout(() => {
        setOpen(false);
      }, transitionDuration * 1000 * 0.1);
    }
  }, [showContent]);

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        ref={ref}
        sx={{ position: 'relative', height: '100%' }}
        onClick={() => {
          setOpen(!open);
          setScrollTop(document.documentElement.scrollTop);
        }}
      >
        {triggerElement}
        <Box
          sx={{
            position: 'absolute',
            visibility: open ? 'visible' : 'hidden',

            bgcolor: 'background.paper',
            boxShadow: 6,
            minWidth: '100%',
            minHeight: '100%',
            borderRadius: 2,
            left: 0,
            top: 0,
            zIndex: 100,

            ...(position === 'relative' ? {
              transform: `translate(calc(-50% + ${(ref.current?.offsetWidth || 1) / 2}px), calc(-50% + ${(ref.current?.offsetHeight || 1) / 2}px))`,
            } : {
              // transform: `translate(${translateX}px, calc(-50% + ${(ref.current?.offsetHeight || 1) / 2}px))`,
            }),

            ...(open ? {
              transition: `width ${transitionDuration}s ease-in-out, height ${transitionDuration}s ease-in-out, transform ${transitionDuration}s ease-in-out`,
              width,
              height,
              animation: `zoom-in-scheet ${transitionDuration}s ease-in-out`,

              ...(position === 'absolute' && {
                transform: `translate(${translateX}px, ${translateY}px)`,
              }),

            } : {
              transition: `visibility ${transitionDuration}s, width ${transitionDuration}s ease-in-out, height ${transitionDuration}s ease-in-out, transform ${transitionDuration}s ease-in-out`,
              animation: `zoom-out-scheet ${transitionDuration}s ease-in-out`,
              width: ref.current?.offsetWidth,
              height: ref.current?.offsetHeight,
              transform: 'translate(0px, 0px)',
            }),

            overflow: 'hidden',
          }}
          onClick={e => e.stopPropagation()}
        >
          <Box sx={{
            visibility: showContent ? 'visible' : 'hidden',
            width: '100%',
            height: '100%',
            // overflowY: 'scroll',
          }}>
            {showContent ? children : null}
          </Box>
        </Box>
      </Box>

      {/* Backdrop */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#00000080',
        visibility: open ? 'visible' : 'hidden',
        opacity: open ? 1 : 0,
        zIndex: 99,
        ...(open ? {
          transition: `visibility 0s, opacity ${transitionDuration}s linear`,
        } : {
          transition: `visibility ${transitionDuration}s, opacity ${transitionDuration}s linear`,
        }),
      }} onClick={() => {
        setShowContent(false);
      }}></Box>
    </Box>
  );
}
