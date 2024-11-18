import clsx from 'clsx';

type ContainerProps = {
  children?: React.ReactNode;
  // sx?: SxProps;
  className?: string;
  style?: React.CSSProperties;
}

export default function Container({ children, className, style }: ContainerProps) {
  return (
    <div className={clsx('max-w-[1200px] mx-auto px-4 sm:px-6', className)}
      style={style}
    // sx={{
    //   px: {
    //     xs: '1rem!important',
    //     sm: '2rem!important',
    //   },
    //   ...sx,
    // }}
    // className={className}
    >
      {children}
    </div>
  );
}
