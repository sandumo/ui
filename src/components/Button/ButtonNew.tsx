import React, { useState } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useThemeContext } from '../../providers/Theme/ThemeProvider';
import { Theme } from '../../providers/Theme/theme';
import NextLink from 'next/link';
import LoadingDots from '../LoadingDots';
import { useFormContext } from '../Form';

type BaseButtonProps = {
  children: React.ReactNode,
  className?: string,
  variant?: keyof Theme['components']['Button']['variant'],
  color?: keyof Theme['components']['Button']['color'],
  size?: keyof Theme['components']['Button']['size'],
  fullWidth?: boolean,

  disabled?: boolean,

  endIcon?: React.ReactNode,
  startIcon?: React.ReactNode,

  submit?: boolean,
  download?: boolean | string;
}

type AnchorButtonProps = BaseButtonProps & {
  href: string,
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>,
}

type RegularButtonProps = BaseButtonProps & {
  href?: never,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
}

type ButtonProps = AnchorButtonProps | RegularButtonProps
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
  ...props
}: ButtonProps) {
  const styles = useThemeContext().theme.components.Button;

  const [loading, setLoading] = useState(false);

  const { pending } = useFormContext();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // Handle download links with loading state
    if (props.download && props.href) {
      setLoading(true);
      // Let the browser handle the download natively
      // Just show brief loading feedback for better UX
      setTimeout(() => setLoading(false), 5000);
    }

    if (!onClick) return;

    if (loading) return;

    if (isPromise(onClick)) {
      setLoading(true);
      await onClick?.(e as any);
      setLoading(false);
    } else {
      onClick?.(e as any);
    }
  };

  const isLoading = loading || (pending && props.submit);

  return (
    <DynamicButton className={twMerge(styles.wrapper, styles.variant[variant][color], styles.size[size], fullWidth && 'w-full', disabled && 'opacity-20 cursor-not-allowed', className)} onClick={handleClick} {...props}>
      <div className={twMerge(styles.root, 'w-full', isLoading && 'opacity-0')}>
        {startIcon && <div className={clsx('flex items-center *:!-ml-1', styles.icon[size])}>{startIcon}</div>}
        <div className={clsx(styles.text[size], 'w-full text-center', 'text-nowrap')}>{children}</div>
        {endIcon && <div className={clsx('flex items-center *:!-mr-1', styles.icon[size])}>{endIcon}</div>}
      </div>

      {isLoading && (
        <div className={twMerge('absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none', twPickTextColor(styles.color[color]))}>
          <LoadingDots />
        </div>
      )}
    </DynamicButton>
  );
}

function DynamicButton(props: ButtonProps) {
  const { children, href, submit = false, download = false, variant, color, size, fullWidth, disabled, endIcon, startIcon, ...restProps } = props as any;

  if (typeof href === 'string') {
    return <NextLink href={href} download={download} {...restProps}>{children}</NextLink>;
  }

  return <button type={submit ? 'submit' : 'button'} disabled={disabled} {...restProps}>{children}</button>;
}

function isPromise(fn: any) {
  return fn.constructor.name === 'AsyncFunction';
}

function twPickTextColor(className: string) {
  const textColor = className.split(' ').find((c) => c.startsWith('text-'));
  return textColor ? textColor.split('-')[1] : 'white';
}
