import { Container as MuiContainer, SxProps } from '@mui/material';

type ContainerProps = {
  children: React.ReactNode;
  sx?: SxProps;
  className?: string;
}

export default function Container({ children, sx, className }: ContainerProps) {
  return (
    <MuiContainer sx={{
      px: {
        xs: '1rem!important',
        sm: '2rem!important',
      },
      ...sx,
    }}
    className={className}
    >
      {children}
    </MuiContainer>
  );
}
