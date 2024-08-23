import { Box, SxProps } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import IconButton from '../IconButton';
import { ArrowBackIcon, ArrowForwardIcon, CloseIcon } from '../../icons';

// type ImageSliderProps<T> = {
//   open: boolean;
//   onClose: () => void;
//   sx?: SxProps
//   images: T[];
//   getImageURL?: (image: T) => string;
//   desktopArrows?: boolean;
// }

export function ImageSlider1<T>({
  // open,
  // onClose,
  images,
  getImageURL = (image: T) => image as unknown as string,
  sx,
  desktopArrows = false,
}: ImageSliderProps<T>) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // const [open, setOpen] = useState(false);

  const [currentImage, setCurrentImage] = useState<T>(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // let timeout: NodeJS.Timeout;

    // if (ref.current) {
    //   const v = index * ((ref.current.scrollWidth - (items.length - 1) * 24) / items.length) + (items.length - 1) * 24;

    //   const px = Number(window.getComputedStyle(ref.current).getPropertyValue('padding-left').split('px')[0]);

    //   const itemWidth = (ref.current.scrollWidth - px * 2 - (items.length - 1) * 24) / items.length;
    //   const left = index * itemWidth + index * 24;

    //   ref.current.scroll({
    //     behavior: 'smooth',
    //     left: left,
    //   });

    //   timeout = setTimeout(() => setIndex(index + 1 >= items.length ? 0 : index + 1), 5000);
    // }

    // return () => clearTimeout(timeout);
  }, [index, ref]);

  const prev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const next = () => {
    setCurrentIndex(currentIndex + 1);
  };

  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: '#00000080',
        backdropFilter: 'blur(10px)',
        zIndex: 1,
      }}
      // onClick={() => onClose()}
    >
      <Box
        ref={ref}
        sx={{
          overflowX: 'scroll',
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          scrollPadding: {
            xs: '.5rem',
            sm: '1.5rem',
          },
          position: 'relative',
          whiteSpace: 'nowrap',
          '& > *': {
            display: 'inline-block!important',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          },
          '& > * > *': {
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
          },
          '& > *:not(:last-child)': {
            // mr: 6,
          },
          height: '100%',
          px: {
            xs: 2,
            sm: 6,
          },
          pt: {
            xs: 2,
            sm: 6,
          },
          pb: {
            xs: '52px',
            sm: '64px',
          },

          ...sx,
        }}
        onScroll={(e) => {
          setCurrentIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth));
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              height: '100%',
              position: 'relative',
              width: '100%',
              mx: 6,
            }}
          >
            <Image src={'/api/storage/' + getImageURL(image)} fill style={{ objectFit: 'contain' }} alt="" unoptimized />
          </Box>
        ))}
      </Box>

      {/* Counter */}
      <Box sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        pb: {
          xs: 4,
          sm: 6,
        },
      }}>
        <Box sx={{ bgcolor: '#00000080', py: .5, px: 2, borderRadius: 1, color: '#fff' }}>
          {currentIndex + 1} / {images.length}
        </Box>
      </Box>

      {/* Left Arrow */}
      <div className="fixed top-1/2 left-4 z-10" onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={prev}>
          <ArrowBackIcon sx={{ color: 'white' }} />
        </IconButton>
      </div>

      {/* Right Arrow */}
      <div className="fixed top-1/2 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={next}>
          <ArrowForwardIcon sx={{ color: 'white' }} />
        </IconButton>
      </div>
    </Box>
  );
}

// import { Box, SxProps } from '@mui/material';
// import Image from 'next/image';
// import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
// import IconButton from '../IconButton';
// import ImageSlider from '../ImageSlider';
// import { ArrowBackIcon, ArrowForwardIcon } from '../../icons';

type ImageSliderProps<T> = {
  open: boolean;
  onClose: () => void;
  sx?: SxProps
  images: T[];
  getImageURL?: (image: T) => string;
  zoom?: boolean;
  zoomInAnimation?: boolean;
  arrows?: boolean;
  desktopArrows?: boolean;
  index?: number;
  onIndexChange?: (index: number) => void;
}

export default function ImageSlider<T>({
  open,
  onClose,
  images,
  getImageURL = (image: T) => image as unknown as string,
  sx,
  zoom,
  arrows,
  zoomInAnimation = false,
  desktopArrows = false,
  index = 0,
  onIndexChange,
}: ImageSliderProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  // const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);
  const [wait, setWait] = useState(false);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    console.log('[x] index', index);
    // setPicked(true);
    setCurrentIndex(index);
    if (ref.current) {
      console.log('[x] index epta', index);
      ref.current.scroll({
        behavior: 'instant' as any,
        left: index * (ref.current.clientWidth + 24),
      });
    }

  }, [index, open]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (ref.current && picked) {
      ref.current.scroll({
        behavior: 'smooth',
        left: currentIndex * (ref.current.clientWidth + 24),
      });

      setWait(true);

      timeout = setTimeout(() => setWait(false), 300);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, ref, picked]);

  // useEffect(() => {
  //   onIndexChange?.(currentIndex);
  // }, [currentIndex, onIndexChange]);

  const next = (e: any) => {
    e.stopPropagation();

    if (currentIndex === images.length - 1) return;

    setCurrentIndex(currentIndex + 1);
    onIndexChange?.(currentIndex + 1);
    setPicked(true);
  };

  const prev = (e: any) => {
    e.stopPropagation();

    if (currentIndex === 0) return;

    setCurrentIndex(currentIndex - 1);
    onIndexChange?.(currentIndex - 1);
    setPicked(true);
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur bg-black/50 p-2 flex flex-col items-center justify-center">
      <div className="aspect-square rounded-xl overflow-hidden relative w-full flex-1">
        <Box
          ref={ref}
          className="overflow-x-scroll overflow-y-hidden relative h-full whitespace-nowrap"
          sx={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
            whiteSpace: 'nowrap',
            '& > *': {
              display: 'inline-block!important',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            },

            ...sx,
          }}
          onScroll={(e) => {
            if (wait) return;

            setCurrentIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth));
            onIndexChange?.(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth));
            setPicked(false);
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full relative rounded-xl overflow-hidden not-last:mr-4" onClick={() => onClose()}>
              <Image src={'/api/storage/' + getImageURL(image)} fill style={{ objectFit: 'contain' }} alt="" className={clsx((zoom || zoomInAnimation) && 'hover:scale-105 transition-all duration-300', zoom && 'cursor-zoom-in')}   />
            </div>
          ))}
        </Box>

        {/* Bullets tracker */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-0 flex justify-center items-end">
            <div className="h-8 flex justify-center items-center not-last-child:mr-2">
              {images.map((i, index) => (
                <div className={clsx('w-2 h-2 rounded-full bg-white drop-shadow-lg hover:opacity-90 cursor-pointer', index === currentIndex ? 'opacity-100' : 'opacity-50')} onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); setPicked(true); }} />
              ))}
            </div>
          </div>
        )}

        {/* Left arrow */}
        {(arrows || desktopArrows) && currentIndex > 0 && (
          <div className={clsx('absolute left-2 top-[calc((100%-40px)/2)]', desktopArrows ? 'hidden md:block' : 'block')}>
            <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={prev}>
              <ArrowBackIcon sx={{ color: 'white' }} />
            </IconButton>
          </div>
        )}

        {/* Right arrow */}
        {(arrows || desktopArrows) && currentIndex < images.length - 1 && (
          <div className={clsx('absolute right-2 top-[calc((100%-40px)/2)]', desktopArrows ? 'hidden md:block' : 'block')}>
            <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={next}>
              <ArrowForwardIcon sx={{ color: 'white' }} />
            </IconButton>
          </div>
        )}
      </div>

      <div className="-m-4 mt-0 p-4 w-full flex justify-center" onClick={() => onClose()}>
        <IconButton className="bg-white w-12 h-12" sx={{ backgroundColor: '#ffffffb0', '&:hover': { backgroundColor: '#ffffffd0' } }} onClick={() => onClose()}>
          <CloseIcon className="text-black" />
        </IconButton>
      </div>
    </div>
  );
}
