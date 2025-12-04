import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type SegmentedButtonProps<T> = Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> & {
  label?: string;
  options: T[];
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;

  value?: T;
  onChange?: (value: T) => void;
};

export default function SegmentedButton<T>({
  label,
  options,
  getOptionLabel = option => String(option),
  getOptionValue = option => String(option),
  value,
  onChange,
  className,
  ...props
}: SegmentedButtonProps<T>) {
  const [internalValue, setInternalValue] = useState<T | null>(value || null);

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (value: T) => {
    setInternalValue(value);
    onChange?.(value);
  };

  return (
    <div>
      {label && <div className="text-xs font-bold mb-1">{label}</div>}
      <div className={twMerge('h-[42px] inline-flex border border-slate-200 rounded', className)} {...props}>
        {options.map((option, index) => (
          <div
            key={getOptionValue(option)}
            onClick={() => handleChange(option)}
            className={twMerge(
              'flex items-center justify-center font-medium h-full px-3 relative cursor-pointer flex-1 whitespace-nowrap bg-slate-50',
              index === 0 && 'rounded-l-[3px]',
              index === options.length - 1 && 'rounded-r-[3px]',
              index < options.length - 1 && 'after:content-[""] after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[1px] after:bg-divider/80',
              internalValue && getOptionValue(option) === getOptionValue(internalValue) ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100',
            )}
          >
            {getOptionLabel(option)}
          </div>
        ))}
      </div>
    </div>
  );
}
