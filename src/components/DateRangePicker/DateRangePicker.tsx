import { useEffect, useRef, useState } from 'react';
import datetime, { Datetime } from '@sandumo/datetime';
import { useFormContext } from '../Form/Form.context';
import { LuCalendar } from 'react-icons/lu';
import Calendar from '../Calendar';
import Popover from '../Popover';
import { twMerge } from 'tailwind-merge';

type DateRange = [string, string];

type DateRangePickerProps = {
  name?: string;
  label?: string;
  value?: DateRange;
  className?: string;
  defaultValue?: DateRange;
  error?: boolean;
  helperText?: string;
  onChange?: (value: DateRange) => void;
};

export default function DateRangePicker({
  name,
  label,
  defaultValue: _defaultValue,
  value: _value,
  onChange,
  className,
}: DateRangePickerProps) {
  const { errors } = useFormContext();

  let defaultValue: [Datetime, Datetime] = _value ? [datetime(_value[0]), datetime(_value[1])] : _defaultValue ? [datetime(_defaultValue[0]), datetime(_defaultValue[1])] : [datetime(), datetime()];

  const [value, setValue] = useState<[Datetime, Datetime]>(defaultValue);
  const [inputValue, setInputValue] = useState<string>(`${defaultValue[0].format('DD.MM.YYYY')} - ${defaultValue[1].format('DD.MM.YYYY')}`);
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  // Sync inputValue when value changes (controlled component)
  useEffect(() => {
    if (_value) {
      const newRange: [Datetime, Datetime] = [datetime(_value[0]), datetime(_value[1])];
      setValue(newRange);
      setInputValue(`${newRange[0].format('DD.MM.YYYY')} - ${newRange[1].format('DD.MM.YYYY')}`);
      setError('');
    }
  }, [_value]);

  // Restore cursor position after state update
  useEffect(() => {
    if (cursorPositionRef.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      cursorPositionRef.current = null;
    }
  }, [inputValue]);

  const validateSingleDate = (dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;

    const parts = dateStr.split('.');
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) return false;
    if (day < 1 || day > 31 || month < 1 || month > 12) return false;

    // Validate day against month/year
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const currentValue = input.value;
    const key = e.key;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Only apply separator protection if the value is long enough to have a separator
    const hasSeparator = currentValue.length >= 13 && currentValue.substring(10, 13) === ' - ';

    // Handle Backspace - prevent removing the dash separator " - " but allow deleting digits
    if (key === 'Backspace') {
      if (hasSeparator) {
        // Check if backspace would delete part of the separator
        if (selectionStart === selectionEnd) {
          // Single character deletion
          const positionBeforeCursor = selectionStart - 1;

          // Positions 10, 11, 12 are " - " (space-dash-space)
          if (positionBeforeCursor >= 10 && positionBeforeCursor <= 12) {
            e.preventDefault();
            return;
          }
        } else {
          // Range deletion - check if selection includes the separator
          if (selectionStart <= 12 && selectionEnd > 10) {
            e.preventDefault();
            return;
          }
        }
      }
      // Backspace is safe to use, allow it
      return;
    }

    // Handle Delete - prevent removing the dash separator " - " but allow deleting digits
    if (key === 'Delete') {
      if (hasSeparator) {
        // Check if delete would remove part of the separator
        if (selectionStart === selectionEnd) {
          // Single character deletion
          const positionAtCursor = selectionStart;

          // Positions 10, 11, 12 are " - " (space-dash-space)
          if (positionAtCursor >= 10 && positionAtCursor <= 12) {
            e.preventDefault();
            return;
          }
        } else {
          // Range deletion - check if selection includes the separator
          if (selectionStart <= 12 && selectionEnd > 10) {
            e.preventDefault();
            return;
          }
        }
      }
      // Delete is safe to use, allow it
      return;
    }

    // Allow other control keys
    if (['Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
      return;
    }

    // Allow Ctrl/Cmd shortcuts (but not Ctrl+X for cut if it includes separator)
    if (e.ctrlKey || e.metaKey) {
      // Prevent cut/delete if selection includes the separator
      if (hasSeparator && (key === 'x' || key === 'X') && selectionStart <= 12 && selectionEnd > 10) {
        e.preventDefault();
        return;
      }
      return;
    }

    // Only allow digits, period, space, and dash
    if (!/^[0-9.\s\-]$/.test(key)) {
      e.preventDefault();
      return;
    }

    // Prevent typing/replacing in the separator area (positions 10-12)
    if (hasSeparator && selectionStart <= 12 && selectionStart >= 10) {
      // If typing at position 10, 11, or 12, skip to position 13
      e.preventDefault();
      input.setSelectionRange(13, 13);
      return;
    }

    // Prevent replacing if selection includes the separator
    if (hasSeparator && selectionStart <= 12 && selectionEnd > 10) {
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

      // If cursor is in separator area, skip to after separator
      if (targetPos >= 10 && targetPos <= 12 && hasSeparator) {
        targetPos = 13;
      }

      // Only apply overwrite if we're not at the end and there's a character to overwrite
      if (targetPos < currentValue.length) {
        e.preventDefault();

        let newValue = currentValue;
        let nextPos = targetPos + 1;
        let shouldAutoPad = false;

        // Check if we should auto-pad for first date day (position 0)
        if (targetPos === 0) {
          const digit = parseInt(key, 10);
          if (digit > 3) {
            // Auto-pad: prepend '0' and skip to month section
            shouldAutoPad = true;
            newValue = '0' + key + currentValue.substring(2);
            nextPos = 3; // Move to first position of month
          }
        }

        // Check if we should auto-pad for first date month (position 3)
        if (!shouldAutoPad && targetPos === 3) {
          const digit = parseInt(key, 10);
          if (digit > 1) {
            // Auto-pad: prepend '0' and skip to year section
            shouldAutoPad = true;
            newValue = currentValue.substring(0, 3) + '0' + key + currentValue.substring(5);
            nextPos = 6; // Move to first position of year
          }
        }

        // Check if we should auto-pad for second date day (position 13)
        if (!shouldAutoPad && targetPos === 13) {
          const digit = parseInt(key, 10);
          if (digit > 3) {
            // Auto-pad: prepend '0' and skip to month section
            shouldAutoPad = true;
            newValue = currentValue.substring(0, 13) + '0' + key + currentValue.substring(15);
            nextPos = 16; // Move to first position of second date month
          }
        }

        // Check if we should auto-pad for second date month (position 16)
        if (!shouldAutoPad && targetPos === 16) {
          const digit = parseInt(key, 10);
          if (digit > 1) {
            // Auto-pad: prepend '0' and skip to year section
            shouldAutoPad = true;
            newValue = currentValue.substring(0, 16) + '0' + key + currentValue.substring(18);
            nextPos = 19; // Move to first position of second date year
          }
        }

        if (!shouldAutoPad) {
          // Regular overwrite behavior
          newValue = currentValue.substring(0, targetPos) + key + currentValue.substring(targetPos + 1);

          // Validate the new value before applying
          const rangeParts = newValue.split(' - ');
          let isValid = true;

          // Determine which date we're editing (first or second)
          const isFirstDate = targetPos < 10;
          const datePart = isFirstDate ? rangeParts[0] : rangeParts[1];

          if (datePart) {
            const parts = datePart.split('.');

            // Validate day (positions 0-1 for first date, 13-14 for second)
            if (parts[0] && parts[0].length > 0) {
              const day = parseInt(parts[0], 10);
              if (parts[0].length === 1 && day > 3) {
                isValid = false;
              } else if (parts[0].length === 2 && (day < 1 || day > 31)) {
                isValid = false;
              }
            }

            // Validate month (positions 3-4 for first date, 16-17 for second)
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
          }

          if (!isValid) {
            return;
          }

          // Find next cursor position (skip dots and separator)
          nextPos = targetPos + 1;
          if (newValue[nextPos] === '.') {
            nextPos++;
          }
          if (nextPos >= 10 && nextPos <= 12 && hasSeparator) {
            nextPos = 13;
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

          // Try to parse the dates if format is complete (23 characters)
          if (newValue.length === 23) {
            const rangeParts = newValue.split(' - ');
            if (rangeParts.length === 2 && rangeParts[0].length === 10 && rangeParts[1].length === 10) {
              try {
                const startDate = datetime(rangeParts[0], 'DD.MM.YYYY');
                const endDate = datetime(rangeParts[1], 'DD.MM.YYYY');

                // Check if both dates are valid
                startDate.toDateFormat();
                endDate.toDateFormat();

                setValue([startDate, endDate]);
                if (onChange) {
                  onChange([startDate.toDateFormat(), endDate.toDateFormat()]);
                }
              } catch (e) {
                // Invalid dates, keep the input but don't update the datetime value
              }
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

    // Check length (DD.MM.YYYY - DD.MM.YYYY = 23 characters)
    if (newValue.length > 23) {
      e.preventDefault();
      return;
    }

    // Split by dash to get two date parts
    const rangeParts = newValue.split(' - ');

    // Validate first date part
    if (rangeParts[0]) {
      const parts = rangeParts[0].split('.');

      // Check first part (day) - max 2 digits
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

      // Check second part (month) - max 2 digits
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

      // Check third part (year) - max 4 digits
      if (parts[2]) {
        // Check if we're still in the first date or crossing to the separator
        const yearPart = parts[2].split(' ')[0]; // Get only the year part before any space
        if (yearPart.length > 4) {
          e.preventDefault();
          return;
        }
      }

      // Validate complete first date
      if (parts[0] && parts[1] && parts[2] && parts[0].length === 2 && parts[1].length === 2) {
        const yearPart = parts[2].split(' ')[0];
        if (yearPart.length === 4) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10);
          const year = parseInt(yearPart, 10);
          const daysInMonth = new Date(year, month, 0).getDate();

          if (day > daysInMonth) {
            e.preventDefault();
            return;
          }
        }
      }
    }

    // Validate second date part (if exists)
    if (rangeParts[1]) {
      const parts = rangeParts[1].split('.');

      // Check first part (day) - max 2 digits
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

      // Check second part (month) - max 2 digits
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

      // Check third part (year) - max 4 digits
      if (parts[2] && parts[2].length > 4) {
        e.preventDefault();
        return;
      }

      // Validate complete second date
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
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Only apply separator protection if the value is long enough to have a separator
    const hasSeparator = currentValue.length >= 13 && currentValue.substring(10, 13) === ' - ';

    // Prevent pasting if it would affect the separator
    if (hasSeparator && selectionStart <= 12 && selectionEnd > 10) {
      e.preventDefault();
      return;
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

    // Try to parse the dates if format is complete (23 characters)
    if (newInputValue.length === 23) {
      const rangeParts = newInputValue.split(' - ');
      if (rangeParts.length === 2 && rangeParts[0].length === 10 && rangeParts[1].length === 10) {
        try {
          const startDate = datetime(rangeParts[0], 'DD.MM.YYYY');
          const endDate = datetime(rangeParts[1], 'DD.MM.YYYY');

          // Check if both dates are valid
          startDate.toDateFormat();
          endDate.toDateFormat();

          setValue([startDate, endDate]);
          if (onChange) {
            onChange([startDate.toDateFormat(), endDate.toDateFormat()]);
          }
        } catch (e) {
          // Invalid dates, keep the input but don't update the datetime value
        }
      }
    }
  };

  const padDatePart = (dateStr: string): string => {
    const parts = dateStr.split('.');
    if (parts.length !== 3) return dateStr;

    // Validate and pad day
    if (parts[0].length === 1) {
      const day = parseInt(parts[0], 10);
      if (day === 0 || isNaN(day)) return dateStr;
      parts[0] = '0' + parts[0];
    } else if (parts[0].length === 2) {
      const day = parseInt(parts[0], 10);
      if (day === 0 || isNaN(day)) return dateStr;
    }

    // Validate and pad month
    if (parts[1].length === 1) {
      const month = parseInt(parts[1], 10);
      if (month === 0 || isNaN(month)) return dateStr;
      parts[1] = '0' + parts[1];
    } else if (parts[1].length === 2) {
      const month = parseInt(parts[1], 10);
      if (month === 0 || isNaN(month)) return dateStr;
    }

    return parts.join('.');
  };

  const handleBlur = () => {
    // If input is empty, clear error
    if (!inputValue || inputValue.trim() === '') {
      setError('');
      return;
    }

    const rangeParts = inputValue.split(' - ');

    // Check if we have the dash separator
    if (rangeParts.length !== 2) {
      setError('Format invalid (DD.MM.YYYY - DD.MM.YYYY)');
      return;
    }

    // Try to pad both dates
    let startDateStr = rangeParts[0].trim();
    let endDateStr = rangeParts[1].trim();

    const paddedStart = padDatePart(startDateStr);
    const paddedEnd = padDatePart(endDateStr);

    // Check if padding failed (returned original invalid value)
    if ((paddedStart !== startDateStr || paddedEnd !== endDateStr)) {
      const newInputValue = `${paddedStart} - ${paddedEnd}`;
      setInputValue(newInputValue);
      startDateStr = paddedStart;
      endDateStr = paddedEnd;
    }

    // Validate both dates are complete
    if (startDateStr.length !== 10 || endDateStr.length !== 10) {
      setError('Date incomplete');
      return;
    }

    // Validate start date has no zeros
    const startParts = startDateStr.split('.');
    if (startParts.some(p => parseInt(p, 10) === 0 || isNaN(parseInt(p, 10)))) {
      setError('Data invalidă');
      return;
    }

    // Validate end date has no zeros
    const endParts = endDateStr.split('.');
    if (endParts.some(p => parseInt(p, 10) === 0 || isNaN(parseInt(p, 10)))) {
      setError('Data invalidă');
      return;
    }

    // Try to parse both dates
    try {
      const startDate = datetime(startDateStr, 'DD.MM.YYYY');
      const endDate = datetime(endDateStr, 'DD.MM.YYYY');

      startDate.toDateFormat();
      endDate.toDateFormat();

      setValue([startDate, endDate]);
      if (onChange) {
        onChange([startDate.toDateFormat(), endDate.toDateFormat()]);
      }
      setError('');
    } catch (e) {
      setError('Data invalidă');
    }
  };

  return (
    <div>
      <input type="hidden" name={name ? `${name}:json` : undefined} value={JSON.stringify([value?.[0]?.toDateFormat(), value?.[1]?.toDateFormat()])} />

      {label && (
        <div className="text-xs font-bold mb-1">{label}</div>
      )}

      <div className={twMerge('h-[42px] bg-[#00000006] border rounded flex items-center justify-between', error ? 'border-red-500' : 'border-[#00000010] hover:border-[#9ca3af]', className)} ref={ref}>
        <input ref={inputRef} type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} onPaste={handlePaste} onBlur={handleBlur} onFocus={() => setAnchorEl(ref.current)} className="bg-transparent flex-1 pl-3 pr-1 h-full outline-none" placeholder="DD.MM.YYYY - DD.MM.YYYY" />

        <div className="h-8 aspect-square flex items-center justify-center mr-1 hover:bg-black/5 rounded cursor-pointer" onClick={(e) => setAnchorEl(ref.current)}>
          <LuCalendar className="text-xl text-gray-500" />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}

      <Popover anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} className="bg-white rounded-lg border-[.1px] border-black/20 pt-3 shadow-xl">
        <Calendar value={[value[0].toDateFormat(), value[1].toDateFormat()]} onChange={(newValue) => {
          const newRange: [Datetime, Datetime] = [datetime(newValue[0]), datetime(newValue[1])];
          setValue(newRange);
          setInputValue(`${newRange[0].format('DD.MM.YYYY')} - ${newRange[1].format('DD.MM.YYYY')}`);
          setError('');
          if (onChange) {
            onChange([newRange[0].toDateFormat(), newRange[1].toDateFormat()]);
          }
          setAnchorEl(null);
        }} />
      </Popover>
    </div>
  );
}
