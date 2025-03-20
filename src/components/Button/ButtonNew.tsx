import React, { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useThemeContext } from '../../providers/Theme/ThemeProvider';
import { Theme } from '../../providers/Theme/theme';
import NextLink from 'next/link';
import LoadingDots from '../LoadingDots';
import { useFormContext } from '../Form';

type ButtonProps = {
  children: React.ReactNode,
  className?: string,
  variant?: keyof Theme['components']['Button']['variant'],
  color?: keyof Theme['components']['Button']['color'],
  size?: keyof Theme['components']['Button']['size'],
  fullWidth?: boolean,

  disabled?: boolean,
  href?: string,
  onClick?: () => void | Promise<void>,

  endIcon?: React.ReactNode,
  startIcon?: React.ReactNode,

  submit?: boolean,
}

export default function ButtonNew({
  children,
  variant = 'default',
  color = 'default',
  size = 'md',
  className,
  fullWidth = false,
  disabled = false,
  onClick,
  endIcon,
  startIcon,
  submit = false,
  ...props
}: ButtonProps) {
  const styles = useThemeContext().theme.components.Button;

  const [loading, setLoading] = useState(false);

  const { pending } = useFormContext();

  const handleClick = async () => {
    if (!onClick) return;

    if (isPromise(onClick)) {
      setLoading(true);
      await onClick?.();
      setLoading(false);
    } else {
      onClick?.();
    }
  };

  return (
    <DynamicButton className={twMerge(styles.wrapper, styles.variant[variant][color], styles.size[size], fullWidth && 'w-full', className)} onClick={handleClick} {...props}>
      <div className={twMerge(styles.root, 'w-full', (loading || pending) && 'opacity-0')}>
        {startIcon && <div className={clsx('flex items-center *:!-ml-1', styles.icon[size])}>{startIcon}</div>}
        <div className={clsx(styles.text[size], 'w-full text-center', 'text-nowrap')}>{children}</div>
        {endIcon && <div className={clsx('flex items-center *:!-mr-1', styles.icon[size])}>{endIcon}</div>}
      </div>

      {(loading || pending) && (
        <div className={twMerge('absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none', twPickTextColor(styles.color[color]))}>
          <LoadingDots />
        </div>
      )}
    </DynamicButton>
  );
}

function DynamicButton({ children, href, submit, ...props }: ButtonProps) {
  if (href) {
    return <NextLink href={href} {...props}>{children}</NextLink>;
  }

  return <button type={submit ? 'submit' : 'button'} {...props}>{children}</button>;
}

function isPromise(fn: any) {
  return fn.constructor.name === 'AsyncFunction';
}

function twPickTextColor(className: string) {
  const textColor = className.split(' ').find((c) => c.startsWith('text-'));
  return textColor ? textColor.split('-')[1] : 'white';
}
