import { Box, SxProps } from '@mui/material';
import NextLink from 'next/link';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  sx?: SxProps;
  className?: string; // It's especially used for PopupMenu link items
  primary?: boolean;
  onClick?: () => void;
}

export default function Link({ children, href, sx, className, primary = false, target = '_self', rel = '', onClick }: LinkProps) {
  return (
    <Box
      component={NextLink}

      // onClick={(e: any) => {
      //   // e.preventDefault();

      //   if (target == '_blank') {
      //     window.open(href, '_blank');
      //   } else {
      //     router.push(href);
      //   }
      // }}
      sx={{
        textDecoration: 'none',
        color: primary ? 'primary.main' : 'inherit',
        ...(sx ? sx : {}),
      }}

      rel={rel}
      href={href}
      {...(className ? { className } : {})}
      onClick={onClick}
      target={target}
    >
      {children}
    </Box>
  );
}
