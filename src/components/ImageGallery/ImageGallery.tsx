import { Box, SxProps } from '@mui/material';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import IconButton from '../IconButton';
import ImageSlider from '../ImageSlider';
import { ArrowBackIcon, ArrowForwardIcon } from '../../icons';

type ImageSliderProps<T> = {
  sx?: SxProps
  images: T[];
  getImageURL?: (image: T) => string;
  zoom?: boolean;
  zoomInAnimation?: boolean;
  arrows?: boolean;
}

export default function ImageGallery<T>({
  images,
  getImageURL = (image: T) => image as unknown as string,
  sx,
  zoom,
  arrows,
  zoomInAnimation = true,
}: ImageSliderProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wait, setWait] = useState(false);
  const [picked, setPicked] = useState(false);

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
    <div className="aspect-square rounded-xl overflow-hidden relative">
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
          <div key={index} className="w-full h-full relative rounded-xl overflow-hidden not-last:mr-4" style={{ borderWidth: '.1px', borderColor: '#00000030' }} onClick={() => setOpen(true)}>
            <Image src={'/api/storage/' + getImageURL(image)} fill style={{ objectFit: 'cover' }} alt="" className={clsx((zoom || zoomInAnimation) && 'hover:scale-105 transition-all duration-300', zoom && 'cursor-zoom-in')}   />
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
      {arrows && currentIndex > 0 && (
        <div className="absolute left-2 top-[calc((100%-40px)/2)]">
          <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={prev}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
      )}

      {/* Right arrow */}
      {arrows && currentIndex < images.length - 1 && (
        <div className="absolute right-2 top-[calc((100%-40px)/2)]">
          <IconButton size="small" className="shadow-lg" sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }} onClick={next}>
            <ArrowForwardIcon sx={{ color: 'white' }} />
          </IconButton>
        </div>
      )}

      {/* Slider */}
      {zoom && <ImageSlider images={images} open={open} onClose={() => setOpen(false)} getImageURL={getImageURL} />}
    </div>
  );
}
