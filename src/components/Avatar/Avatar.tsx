import { Box, SxProps } from '@mui/material';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const nameAbbreviation = (name: string) => {
  const arr = name.split(' ');

  if (arr.length === 1) {
    return name.slice(0, 2);
  }

  return `${arr[0][0]}${arr[1][0]}`;
};

type AvatarProps = {
  src?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'extraLarge' | number;
  sizes?: string;
  variant?: 'circle' | 'rounded' | 'square';
  sx?: SxProps;
  fit?: boolean;
  unoptimized?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseEnter?: (e: SyntheticEvent) => void;
  onMouseLeave?: (e: SyntheticEvent) => void;
  ref?: any;
  className?: string;
  [key: string]: any;
}

export default function Avatar({
  src,
  name = 'O',
  size = 'medium',
  variant = 'circle',
  sx = {},
  fit,
  unoptimized = false,
  sizes = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
  ref,
  className,
  ...props
}: AvatarProps) {
  const [error, setError] = useState(false);

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        position: 'relative',
        width: size === 'small' ? 30 : size === 'medium' ? 40 : size === 'large' ? 50 : size === 'extraLarge' ? 100 : size,
        height: size === 'small' ? 30 : size === 'medium' ? 40 : size === 'large' ? 50 : size === 'extraLarge' ? 100 : size,
        borderRadius: variant === 'circle' ? '50%' : variant === 'rounded' ? 1 : 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        fontWeight: 800,
        fontSize: size === 'small' ? 12 : size === 'medium' ? 16 : size === 'large' ? 18 : size ? ((size as number) * 0.4) : 50,
        // backgroundColor: theme => `${theme.palette.primary.main}15`,
        // color: 'primary.main',
        ...sx,
      }}
      {...(onClick ? { onClick } : {})}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={twMerge('bg-primary text-white', className)}
    >
      {src && !error ? (
        <Image
          src={src}
          fill
          alt={name}
          sizes={sizes}
          onError={e => {
            console.log('[x] error', e);
            setError(true);
          }}
          style={{
            objectFit: fit ? 'contain' : 'cover',
            objectPosition: 'center',
          }}
          unoptimized={unoptimized}
        />
      ) : nameAbbreviation(name?.trim())}
    </Box>
  );
}
