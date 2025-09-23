import { useState } from 'react';
import { IconButtonProps as MuiIconButtonProps, IconButton as MuiIconButton, CircularProgress } from '@mui/material';
import NextLink from 'next/link';

type IconButtonProps = MuiIconButtonProps & {
  href?: string;
  onClick?: (e: any) => Promise<any> | any;
  stopPropagation?: boolean;
  download?: boolean;
  target?: string;
}

export default function IconButton({
  href,
  children,
  onClick,
  sx,
  stopPropagation,
  target, // not working for some reason
  disabled,
  ...props
}: IconButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <MuiIconButton
      {...(href && {
        href: href,
        component: NextLink,
        target: target,
        ...(stopPropagation && !onClick && {
          onClick: (e: any) => {
            e.stopPropagation();
          },
        }),
      })}
      sx={{ position: 'relative', ...sx }}
      onClick={async (e) => {
        if (stopPropagation) e.stopPropagation();

        if (onClick) {
          setLoading(true);
          await onClick(e);
          setLoading(false);
        }
      }}
      disabled={loading || disabled}
      {...props}
    >
      {children}
      {loading && <CircularProgress size={36} thickness={3} sx={{ position: 'absolute' }} />}
    </MuiIconButton>
  );
}
