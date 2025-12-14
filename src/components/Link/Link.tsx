import { Box, SxProps } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  sx?: SxProps;
  className?: string; // It's especially used for PopupMenu link items
  primary?: boolean;
  disableHover?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function appendSlashIfMissing(href: string) {
  if (href.endsWith('/')) {
    return href;
  }

  return href + '/';
}

export default function Link({ children, href, sx, className, primary = false, target = '_self', rel = '', onClick, disableHover = false }: LinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (href && appendSlashIfMissing(router.asPath) === appendSlashIfMissing(href)) {
      router.reload();
    }
  };

  return (
    <Box
      component={NextLink}
      sx={{
        textDecoration: 'none',
        ...(sx ? sx : {}),
      }}

      rel={rel}
      href={href}
      // {...(className ? { className } : {})}
      className={twMerge(disableHover ? '' : 'hover:text-primary', className || '')}
      onClick={handleClick}
      target={target}
    >
      {children}
    </Box>
  );
}
