// import { TypographyProps } from '@mui/material';
// import MuiTypography from '@mui/material/Typography';

import { Box } from "@mui/material";

import { SxProps } from "@mui/material";

type TypographyProps = {
  children: React.ReactNode,
  className?: string,
  sx?: SxProps,
}

// TODO: Add automatic translation of the text
export default function Typography({ children, ...props }: TypographyProps) {
  return (
    <Box {...props}>{children}</Box>
  );
}
