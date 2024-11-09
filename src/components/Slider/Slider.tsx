import { Box } from '@mui/material';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import IconButton from '../IconButton';
import { ArrowBackIcon, ArrowForwardIcon } from '../../icons';

type SliderProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  arrows?: boolean;
  desktopArrows?: boolean;
  index?: number;
  setIndex?: (index: number) => void;
  className?: string;
  autoScroll?: boolean;
}

export default function Slider<T>({ items, renderItem, arrows = false, desktopArrows = false, index: _index, setIndex: _setIndex, className, autoScroll = false }: SliderProps<T>) {
  const [index, __setIndex] = useState(_index || 0);

  const [displayedItems, setDisplayedItems] = useState(0);
  const [autoScrollOverride, setAutoScrollOverride] = useState(false);

  const setIndex = (i: number) => {
    __setIndex(index => {
      if (i >= items.length - displayedItems) {
        return items.length - 1 - (i > index ? 0 : displayedItems);
      }

      return i;
    });
  };

  const ref = useRef<HTMLDivElement>(null);

  const spacing = 32;

  useEffect(() => {
    if (_setIndex) _setIndex(index);
  }, [index]);

  useEffect(() => {
    if (_index !== undefined && _index !== index) {
      setIndex(_index);
      setAutoScrollOverride(true);
    }
  }, [_index]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (ref.current) {
      const px = Number(window.getComputedStyle(ref.current).getPropertyValue('padding-left').split('px')[0]);

      const itemWidth = (ref.current.scrollWidth - px * 2 - (items.length - 1) * spacing) / items.length;
      const left = index * itemWidth + index * spacing;

      setDisplayedItems(Math.floor(ref.current.clientWidth / itemWidth));

      ref.current.scroll({
        behavior: 'smooth',
        left: left,
      });

      if (autoScroll && !autoScrollOverride) timeout = setTimeout(() => setIndex(index + 1 >= items.length ? 0 : index + 1), 5000);
    }

    if (autoScroll && !autoScrollOverride) return () => clearTimeout(timeout);
  }, [index, ref, autoScroll]);

  const prev = () => setIndex(index - 1 < 0 ? items.length - 1 : index - 1);
  const next = () => setIndex(index + 1 >= items.length ? 0 : index + 1);

  return (
    <div className="relative">
      {/* Left arrow */}
      {(arrows || desktopArrows) && index > 0 && (
        <div className={clsx('absolute left-2 top-[calc((100%-40px)/2)] z-10', desktopArrows ? 'hidden md:block' : 'block')}>
          <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={prev}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
      )}

      {/* Right arrow */}
      {(arrows || desktopArrows) && index < items.length - 1 && (
        <div className={clsx('absolute right-2 top-[calc((100%-40px)/2)] z-10', desktopArrows ? 'hidden md:block' : 'block')}>
          <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={next}>
            <ArrowForwardIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
      )}

      <Box
        ref={ref}
        sx={{
          overflow: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          scrollPadding: {
            xs: '2rem',
            sm: '0rem',
          },
          position: 'relative',
          whiteSpace: 'nowrap',
          '& > *': {
            display: 'inline-block!important',
            scrollSnapAlign: 'start',
            width: {
              xs: 'calc(100%)',
              sm: 'calc((100% - 2rem) / 2)',
              md: 'calc((100% - 4rem) / 3)',
              lg: 'calc((100% - 6rem) / 4)',
            },
          },
          '& > *:not(:last-child)': {
            mr: 8,
          },
        }}

        className={clsx('relative', className)}
      >
        {items.map((item, i) => renderItem(item, i))}
      </Box>
    </div>
  );
}
