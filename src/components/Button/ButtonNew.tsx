import React, { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useThemeContext } from '../../providers/Theme/ThemeProvider';
import { Theme } from '../../providers/Theme/theme';
import NextLink from 'next/link';
import LoadingDots from '../LoadingDots';

type ButtonProps = {
  children: React.ReactNode,
  className?: string,
  color?: keyof Theme['components']['Button']['color'],
  size?: keyof Theme['components']['Button']['size'],
  fullWidth?: boolean,

  disabled?: boolean,
  href?: string,
  onClick?: () => void | Promise<void>,

  endIcon?: React.ReactNode,
  startIcon?: React.ReactNode,
}

export default function ButtonNew({
  children,
  color = 'default',
  size = 'md',
  className,
  fullWidth = false,
  disabled = false,
  onClick,
  endIcon,
  startIcon,
  ...props
}: ButtonProps) {
  const styles = useThemeContext().theme.components.Button;

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isPromise(onClick)) {
      setLoading(true);
      await onClick?.();
      setLoading(false);
    } else {
      onClick?.();
    }
  };

  return (
    <DynamicButton className={twMerge(styles.wrapper, styles.color[color], styles.size[size], fullWidth && 'w-full', className)} onClick={handleClick} {...props}>
      <div className={twMerge(styles.root, styles.color[color], loading && 'opacity-0')}>
        {startIcon && <div className={clsx('flex items-center *:!-ml-1', styles.icon[size])}>{startIcon}</div>}
        <span className={clsx(styles.text[size])}>{children}</span>
        {endIcon && <div className={clsx('flex items-center *:!-mr-1', styles.icon[size])}>{endIcon}</div>}
      </div>

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <LoadingDots />
        </div>
      )}
    </DynamicButton>
  );
}

function DynamicButton({ children, href, ...props }: ButtonProps) {
  if (href) {
    return <NextLink href={href} {...props}>{children}</NextLink>;
  }

  return <button {...props}>{children}</button>;
}

function isPromise(fn: any) {
  return fn.constructor.name === 'AsyncFunction';
}
