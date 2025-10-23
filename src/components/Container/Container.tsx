import clsx from 'clsx';

type ContainerProps = {
  children?: React.ReactNode;
  // sx?: SxProps;
  className?: string;
  style?: React.CSSProperties;
}

export default function Container({ children, className, style }: ContainerProps) {
  return (
    <div className={clsx('max-w-[1200px] mx-auto px-4 sm:px-6 md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1024px] 2xl:max-w-[1440px] w-full', className)}
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
