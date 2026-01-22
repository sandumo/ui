import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useFormContext } from '../Form/Form.context';

export interface RadioGroupOption<T extends string | number = string | number> {
  value: T;
  label: ReactNode;
  description: string;
}

export interface RadioGroupProps<T extends string | number = string | number> {
  options: RadioGroupOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}

export default function RadioGroup<T extends string | number>({
  options,
  value: _value,
  defaultValue,
  onChange,
  className,
  disabled,
  name,
}: RadioGroupProps<T>) {
  const [value, setValue] = useState<T | undefined>(_value ?? defaultValue);
  const { errors } = useFormContext();

  // Sync with controlled value prop
  useEffect(() => {
    if (_value !== undefined && _value !== value) {
      setValue(_value);
    }
  }, [_value]);

  // Sync with defaultValue prop when it changes
  useEffect(() => {
    if (_value === undefined && defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (newValue: T) => {
    if (disabled) return;
    setValue(newValue);
    onChange?.(newValue);
  };

  const error = name ? errors[name] : undefined;

  return (
    <div>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      
      <div className={twMerge('flex flex-col gap-1', disabled && 'opacity-50', className)}>
        {options.map(option => (
          <div
            key={option.value}
            className={twMerge(
              'bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 flex items-center gap-3',
              value === option.value && 'bg-primary/5 border-primary',
              disabled
                ? 'cursor-not-allowed'
                : value === option.value
                  ? 'cursor-default'
                  : 'cursor-pointer hover:bg-gray-200 hover:border-gray-300'
            )}
            onClick={() => handleChange(option.value)}
          >
            <div>
              <div
                className={twMerge(
                  'w-4 aspect-square rounded-full bg-white border border-gray-300 ml-1',
                  value === option.value ? 'border-primary border-[5px]' : ''
                )}
              />
            </div>
            <div>
              <div
                className={twMerge(
                  'font-semibold text-sm',
                  value === option.value ? 'text-primary' : 'text-black/70'
                )}
              >
                {option.label}
              </div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
}
