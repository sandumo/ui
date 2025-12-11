import Link from '../Link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type TabBarItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
}

type TabBarProps = {
  items: TabBarItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'icon' | 'text';
}

export default function TabBar({ items, orientation = 'vertical', variant = 'icon' }: TabBarProps) {
  const router = useRouter();
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = [...items].reverse().findIndex(item => router.asPath.startsWith(item.href));
    if (index !== -1) {
      setSelectedItemIndex(items.length - 1 - index);
    }
  }, [router.asPath, items]);

  return (
    <div className={twMerge('flex flex-col gap-2', orientation === 'horizontal' ? 'flex-row' : 'flex-col')}>
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={twMerge('flex items-center justify-center cursor-pointer rounded-md relative group font-medium', selectedItemIndex === index ? 'text-primary bg-primary/10' : 'hover:bg-primary/10', variant === 'text' ? 'px-2 pt-1 pb-[5px]' : 'w-10 h-10')}
        >
          {variant === 'icon' ? item.icon : (
            <div className="text-sm">{item.label}</div>
          )}

          {selectedItemIndex === index && (
            <div className={twMerge('absolute bg-primary', orientation === 'horizontal' ? 'bottom-0 left-[8px] right-[8px] h-[3px] rounded-t' : 'right-0 top-[8px] bottom-[8px] w-[3px] rounded-l')} />
          )}

          {variant === 'icon' && (
            <div className="absolute left-[calc(100%+16px)] z-9999 bg-primary/10 text-primary text-sm font-semibold backdrop-blur-md px-2 py-1 rounded-md box-shadow-5 hidden group-hover:block z-10 whitespace-nowrap">
              {item.label}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
