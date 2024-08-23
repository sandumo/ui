import { Box, SxProps } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import IconButton from '../IconButton';
import { ArrowBackIcon, ArrowForwardIcon, CloseIcon } from '../../icons';

type ImageSliderProps<T> = {
  sx?: SxProps
  images: T[];
  getImageURL?: (image: T) => string;
  zoom?: boolean;
  zoomInAnimation?: boolean;
  arrows?: boolean;
  desktopArrows?: boolean;
}

export default function ImageGallery<T>({
  images,
  getImageURL = (image: T) => image as unknown as string,
  sx,
  zoom,
  arrows,
  zoomInAnimation = true,
  desktopArrows = false,
}: ImageSliderProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const [open, _setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wait, setWait] = useState(false);
  const [picked, setPicked] = useState(false);

  const setOpen = (value: boolean) => {
    if (!zoom) return;
    _setOpen(value);
  };

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

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (ref.current && open) {
      ref.current.scroll({
        behavior: 'instant' as any,
        left: currentIndex * (ref.current.clientWidth + 24),
      });

      setWait(true);

      timeout = setTimeout(() => setWait(false), 300);
    }

    return () => clearTimeout(timeout);
  }, [open]);

  const next = (e: any) => {
    e.stopPropagation();

    if (currentIndex === images.length - 1) return;

    setCurrentIndex(currentIndex + 1);
    setPicked(true);
  };

  const prev = (e: any) => {
    e.stopPropagation();

    if (currentIndex === 0) return;

    setCurrentIndex(currentIndex - 1);
    setPicked(true);
  };

  return (
    <div className={clsx(open && 'fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur bg-black/50 p-2 flex flex-col items-center justify-center')}>
      <div className={clsx('aspect-square rounded-xl overflow-hidden relative', open && 'w-full flex-1')}>
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
            setPicked(false);
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={clsx('w-full h-full relative overflow-hidden not-last:mr-4', !open && 'border-[.5px] border-black/10 rounded-xl')} onClick={() => setOpen(true)}>
              <Image src={'/api/storage/' + getImageURL(image)} fill style={{ objectFit: open ? 'contain' : 'cover' }} alt="" className={clsx((zoom || zoomInAnimation) && !open && 'hover:scale-105 transition-all duration-300', zoom && !open && 'cursor-zoom-in')} />
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

        {/* Slider */}
        {/* {zoom && <ImageSlider index={currentIndex} onIndexChange={(index) => setCurrentIndex(index)} images={images} open={open} onClose={() => setOpen(false)} getImageURL={getImageURL} desktopArrows />} */}
      </div>

      {open && (
        <div className="-m-4 mt-0 p-4 w-full flex justify-center" onClick={() => setOpen(false)}>
          <IconButton className="bg-white w-12 h-12" sx={{ backgroundColor: '#ffffffb0', '&:hover': { backgroundColor: '#ffffffd0' } }} onClick={() => setOpen(false)}>
            <CloseIcon className="text-black" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
