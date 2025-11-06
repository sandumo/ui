import { useEffect, useRef, useState } from 'react';
import datetime, { Datetime } from '@sandumo/datetime';
import { useFormContext } from '../Form/Form.context';
import { LuCalendar } from 'react-icons/lu';
import Calendar from '../Calendar';
import Popover from '../Popover';
import { twMerge } from 'tailwind-merge';

type DatePickerProps =  {
  name?: string;
  value?: string;
  label?: string;
  defaultValue?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function DatePicker({
  name,
  label,
  defaultValue: _defaultValue,
  value: _value,
  onChange,
  className,
}: DatePickerProps) {
  // TODO: Fix this, improve this
  // const defaultValue = props.value ? new Date(props.value as any) : null;

  const { errors } = useFormContext();

  let defaultValue = _value ? datetime(_value as any) : _defaultValue ? datetime(_defaultValue as any) : null;

  const [value, setValue] = useState<Datetime | null>(defaultValue);
  const [inputValue, setInputValue] = useState<string>(defaultValue?.format('DD.MM.YYYY') || '');
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  // Sync inputValue when props.value changes (controlled component)
  useEffect(() => {
    if (_value) {
      const newDate = datetime(_value as any);
      setValue(newDate);
      setInputValue(newDate.format('DD.MM.YYYY'));
      setError(''); // Clear error when value changes externally
    }
  }, [_value]);

  // Restore cursor position after state update
  useEffect(() => {
    if (cursorPositionRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const currentValue = input.value;
    const key = e.key;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Allow control keys
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
      return;
    }

    // Allow Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    // Only allow digits and period
    if (!/^[0-9.]$/.test(key)) {
      e.preventDefault();
      return;
    }

    // Handle digit typing with overwrite behavior (mask input style)
    if (/^[0-9]$/.test(key) && selectionStart === selectionEnd) {
      // Find the position where this digit should be placed
      let targetPos = selectionStart;

      // If cursor is on a dot, skip to the next position
      if (currentValue[targetPos] === '.') {
        targetPos++;
      }

      // Only apply overwrite if we're not at the end and there's a character to overwrite
      if (targetPos < currentValue.length) {
        e.preventDefault();

        // Determine which section we're in (day, month, or year)
        const beforeCursor = currentValue.substring(0, targetPos);
        const dotsBeforeCursor = (beforeCursor.match(/\./g) || []).length;

        let newValue = currentValue;
        let nextPos = targetPos + 1;
        let shouldAutoPad = false;

        // Check if we should auto-pad for day (first section, position 0)
        if (dotsBeforeCursor === 0 && targetPos === 0) {
          const digit = parseInt(key, 10);
          if (digit > 3) {
            // Auto-pad: prepend '0' and skip to month section
            shouldAutoPad = true;
            newValue = '0' + key + currentValue.substring(2);
            nextPos = 3; // Move to first position of month
          }
        }

        // Check if we should auto-pad for month (second section, position 3)
        if (!shouldAutoPad && dotsBeforeCursor === 1 && targetPos === 3) {
          const digit = parseInt(key, 10);
          if (digit > 1) {
            // Auto-pad: prepend '0' and skip to year section
            shouldAutoPad = true;
            newValue = currentValue.substring(0, 3) + '0' + key + currentValue.substring(5);
            nextPos = 6; // Move to first position of year
          }
        }

        if (!shouldAutoPad) {
          // Regular overwrite behavior
          newValue = currentValue.substring(0, targetPos) + key + currentValue.substring(targetPos + 1);

          // Validate the new value before applying
          const parts = newValue.split('.');
          let isValid = true;

          // Validate day
          if (parts[0] && parts[0].length > 0) {
            const day = parseInt(parts[0], 10);
            if (parts[0].length === 1 && day > 3) {
              isValid = false;
            } else if (parts[0].length === 2 && (day < 1 || day > 31)) {
              isValid = false;
            }
          }

          // Validate month
          if (parts[1] && parts[1].length > 0) {
            const month = parseInt(parts[1], 10);
            if (parts[1].length === 1 && month > 1) {
              isValid = false;
            } else if (parts[1].length === 2 && (month < 1 || month > 12)) {
              isValid = false;
            }
          }

          // Validate complete date
          if (parts[0] && parts[1] && parts[2] && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day > daysInMonth) {
              isValid = false;
            }
          }

          if (!isValid) {
            return;
          }

          // Find next cursor position (skip dots)
          nextPos = targetPos + 1;
          if (newValue[nextPos] === '.') {
            nextPos++;
          }
        }

        // Check if value actually changed
        const valueChanged = newValue !== currentValue;

        if (valueChanged) {
          // Set cursor position first, before state update
          cursorPositionRef.current = nextPos;

          // Clear error when user is typing
          if (error) {
            setError('');
          }

          // Update the input value display
          setInputValue(newValue);

          // Try to parse the date if it's complete (10 characters)
          if (newValue.length === 10) {
            try {
              const parsed = datetime(newValue, 'DD.MM.YYYY');
              parsed.toDateFormat();
              setValue(parsed);
              if (onChange) {
                onChange(parsed as any);
              }
            } catch (e) {
              // Invalid date, keep the input but don't update the datetime value
            }
          }
        } else {
          // Value didn't change, but we still need to move the cursor
          input.setSelectionRange(nextPos, nextPos);
        }

        return;
      }
    }

    // Simulate what the value would be after this keystroke
    const newValue = currentValue.substring(0, selectionStart) + key + currentValue.substring(selectionEnd);

    // Check length
    if (newValue.length > 10) {
      e.preventDefault();
      return;
    }

    // Check period count
    const periodCount = (newValue.match(/\./g) || []).length;
    if (periodCount > 2) {
      e.preventDefault();
      return;
    }

    // Validate structure
    const parts = newValue.split('.');

    // Validate day part (first part)
    if (parts[0]) {
      if (parts[0].length > 2) {
        e.preventDefault();
        return;
      }
      const day = parseInt(parts[0], 10);
      if (parts[0].length === 1 && day > 3) {
        e.preventDefault();
        return;
      }
      if (parts[0].length === 2 && (day < 1 || day > 31)) {
        e.preventDefault();
        return;
      }
    }

    // Validate month part (second part)
    if (parts[1]) {
      if (parts[1].length > 2) {
        e.preventDefault();
        return;
      }
      const month = parseInt(parts[1], 10);
      if (parts[1].length === 1 && month > 1) {
        e.preventDefault();
        return;
      }
      if (parts[1].length === 2 && (month < 1 || month > 12)) {
        e.preventDefault();
        return;
      }
    }

    // Validate year part (third part)
    if (parts[2] && parts[2].length > 4) {
      e.preventDefault();
      return;
    }

    // Validate day against month/year
    if (parts[0] && parts[1] && parts[2] && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const daysInMonth = new Date(year, month, 0).getDate();

      if (day > daysInMonth) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    const input = e.target;

    // Save cursor position before state update
    const cursorPos = input.selectionStart || 0;

    // Clear error when user is typing
    if (error) {
      setError('');
    }

    // Save cursor position for restoration (only if not already set by overwrite logic)
    if (cursorPositionRef.current === null) {
      cursorPositionRef.current = cursorPos;
    }

    // Update the input value display
    setInputValue(newInputValue);

    // Try to parse the date if it's complete (10 characters)
    if (newInputValue.length === 10) {
      try {
        const parsed = datetime(newInputValue, 'DD.MM.YYYY');
        // Check if it's a valid date by trying to format it
        parsed.toDateFormat();
        setValue(parsed);
        if (onChange) {
          onChange(parsed as any);
        }
      } catch (e) {
        // Invalid date, keep the input but don't update the datetime value
      }
    }
  };

  const handleBlur = () => {
    // If input is empty, clear error
    if (!inputValue || inputValue.trim() === '') {
      setError('');
      return;
    }

    let processedValue = inputValue;

    // Try to zero-pad if the format looks like it needs padding
    const parts = processedValue.split('.');
    if (parts.length === 3) {
      // Validate and pad day (first part) to 2 digits
      if (parts[0].length === 1) {
        const day = parseInt(parts[0], 10);
        if (day === 0 || isNaN(day)) {
          setError('Data invalidă');
          return;
        }
        parts[0] = '0' + parts[0];
      } else if (parts[0].length === 2) {
        const day = parseInt(parts[0], 10);
        if (day === 0 || isNaN(day)) {
          setError('Data invalidă');
          return;
        }
      }

      // Validate and pad month (second part) to 2 digits
      if (parts[1].length === 1) {
        const month = parseInt(parts[1], 10);
        if (month === 0 || isNaN(month)) {
          setError('Data invalidă');
          return;
        }
        parts[1] = '0' + parts[1];
      } else if (parts[1].length === 2) {
        const month = parseInt(parts[1], 10);
        if (month === 0 || isNaN(month)) {
          setError('Data invalidă');
          return;
        }
      }

      processedValue = parts.join('.');

      // Update the input with the padded value
      if (processedValue !== inputValue) {
        setInputValue(processedValue);
      }
    }

    // If input is incomplete (not 10 characters after padding)
    if (processedValue.length < 10) {
      setError('Data incompletă');
      return;
    }

    // Try to parse the date
    try {
      const parsed = datetime(processedValue, 'DD.MM.YYYY');
      parsed.toDateFormat();
      setValue(parsed);
      if (onChange) {
        onChange(parsed as any);
      }
      setError('');
    } catch (e) {
      setError('Data invalidă');
    }
  };

  return (
    <div>
      <input type="hidden" name={name} value={value?.toDateFormat()} />

      {label && (
        <div className="text-xs font-bold mb-1">{label}</div>
      )}

      <div className={twMerge('h-[42px] bg-[#00000006] border rounded flex items-center justify-between', error ? 'border-red-500' : 'border-[#00000010] hover:border-[#9ca3af]', className)} ref={ref}>
        <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} onBlur={handleBlur} onFocus={() => setAnchorEl(ref.current)} className="bg-transparent flex-1 pl-3 pr-1 h-full outline-none" placeholder="DD.MM.YYYY" />

        <div className="h-8 aspect-square flex items-center justify-center mr-1 hover:bg-black/5 rounded cursor-pointer" onClick={(e) => setAnchorEl(ref.current)}>
          <LuCalendar className="text-xl text-gray-500" />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}

      <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} className="bg-white rounded-lg border-[.1px] border-black/20 pt-3 shadow-xl">
        <Calendar value={value?.toDateFormat() || null} onChange={(newValue) => {
          const newDate = datetime(newValue);
          setValue(newDate);
          setInputValue(newDate.format('DD.MM.YYYY'));
          setError(''); // Clear any error when selecting from calendar
          if (onChange) {
            onChange(newDate as any);
          }
          setAnchorEl(null);
        }} />
      </Popover>
    </div>
  );
}
