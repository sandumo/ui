import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from '../../icons';
import datetime, { Datetime } from '@sandumo/datetime';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';

const DAYS_OF_WEEK = [
  'Lu',
  'Ma',
  'Mi',
  'Jo',
  'Vi',
  'Sâ',
  'Du',
];

const MONTHS = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
];

function zeroPad(value: string | number) {
  return String(value).padStart(2, '0');
}

function range(start: number, end: number) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

type DropdownProps = {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onClose: () => void;
  options: string[];
  className?: string;
}

function Dropdown({ value, onChange, onClose, options, className }: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // handle scroll position to update mask
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setIsAtStart(scrollTop <= 1);
      setIsAtEnd(scrollTop + clientHeight >= scrollHeight - 1);
    }
  };

  // scroll to selected value when opened
  useEffect(() => {
    if (open && scrollContainerRef.current) {
      const selectedIndex = options.indexOf(value);
      if (selectedIndex !== -1) {
        const itemHeight = 28; // h-7 = 28px
        const containerHeight = 230; // h-[230px]
        const scrollPosition = selectedIndex * itemHeight - containerHeight / 2 + itemHeight / 2;
        scrollContainerRef.current.scrollTop = Math.max(0, scrollPosition);
      }
      // Update scroll state after scrolling
      handleScroll();
    }
  }, [open, value, options]);

  // Get mask gradient based on scroll position
  const getMaskGradient = () => {
    if (isAtStart && isAtEnd) {
      return ''; // No mask if content fits
    } else if (isAtStart) {
      return '[mask-image:linear-gradient(to_bottom,black_calc(100%-16px),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_calc(100%-16px),transparent)]';
    } else if (isAtEnd) {
      return '[mask-image:linear-gradient(to_bottom,transparent,black_16px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_16px)]';
    } else {
      return '[mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_16px,black_calc(100%-16px),transparent)]';
    }
  };

  return (
    <div className={twMerge('relative', className)} ref={containerRef}>
      <div className="flex items-center gap-1 font-bold bg-slate-50 p-1 pl-2 rounded-md border border-slate-100 cursor-pointer hover:bg-slate-100" onClick={() => setOpen((prev) => !prev)}>
        <div className="flex-1">{value}</div>
        <UnfoldMoreRoundedIcon fontSize="small" className="text-gray-500" />
      </div>

      {open && (
        <div className="bg-slate-50 rounded-md absolute top-[calc(100%+4px)] z-10 min-w-full drop-shadow">
          <div
            ref={scrollContainerRef}
            className={twMerge('h-[230px] flex flex-col gap-0.5 p-0.5 font-medium overflow-y-scroll no-scrollbar', getMaskGradient())}
            onScroll={handleScroll}
          >
            {options.map((option) => (
              <div key={option} className={twMerge('flex items-center rounded-md px-2 py-1', value === option ? 'bg-primary/10 text-primary' : 'cursor-pointer hover:bg-black/5')} onClick={() => { onChange?.(option); setOpen(false); }}>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type DateRange = [Datetime, Datetime];

type CalendarProps<T extends string | [string, string]> = {
  value?: T | null;
  onChange?: (value: T) => void;
}

export default function Calendar<T extends string | [string, string]>({ value: _value, onChange }: CalendarProps<T>) {
  const [today, setToday] = useState<string | null>(null);
  const isRangePicker = Array.isArray(_value);
  const [value, _setValue] = useState<Datetime | [Datetime, Datetime]>(isRangePicker ? (_value ? [datetime(_value[0]), datetime(_value[1])] : [datetime(), datetime()]) : (_value ? datetime(_value) : datetime()));

  const setValue = (value: Datetime | [Datetime, Datetime]) => {
    _setValue(value);
    if (!waitingForRangeEnd) {
      // onChange?.(value as unknown as T);
    }
  };

  const dateRange: DateRange = isRangePicker ? (value as DateRange) : [value as Datetime, value as Datetime];

  const [year, setYear] = useState(Number(isRangePicker ? (value as [Datetime, Datetime])[0].format('YYYY') : (value as Datetime).format('YYYY')));
  const [month, setMonth] = useState(Number(isRangePicker ? (value as [Datetime, Datetime])[0].format('MM') : (value as Datetime).format('MM')));

  // Set today's date only on the client to avoid hydration mismatch
  useEffect(() => {
    setToday(datetime().toDateFormat());
  }, []);

  const startDate = datetime(`${year}-${zeroPad(month)}-01`).startOf('month').startOfWeek();
  const endDate = datetime(`${year}-${zeroPad(month)}-01`).endOf('month').endOfWeek();

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [waitingForRangeEnd, setWaitingForRangeEnd] = useState(false);
  const [hoveringDate, setHoveringDate] = useState<Datetime | null>(null);

  return (
    <div className="text-sm w-[280px]">
      {/* Month and year */}
      <div className="flex items-center gap-2 justify-between px-1">
        <button className="h-[30px] aspect-square flex items-center justify-center hover:bg-slate-100 rounded-md" onClick={prevMonth}>
          <KeyboardArrowLeftIcon className="w-[14px] h-[14px]" />
        </button>

        <div className="flex items-center gap-2">
          {/* Month */}
          <Dropdown value={MONTHS[month - 1]} onChange={(value) => setMonth(MONTHS.indexOf(value) + 1)} open={showMonth} onClose={() => setShowMonth(false)} options={MONTHS} className="w-[112px]" />

          {/* Year */}
          <Dropdown value={String(year)} onChange={(value) => setYear(Number(value))} open={showYear} onClose={() => setShowYear(false)} options={range(year - 10, year + 1).map(String)} className="w-[72px]" />
        </div>

        <button className="h-[30px] aspect-square flex items-center justify-center hover:bg-slate-100 rounded-md" onClick={nextMonth}>
          <KeyboardArrowRightIcon className="w-[14px] h-[14px]" />
        </button>
      </div>

      <div className={twMerge((showMonth || showYear) ? 'opacity-60' : '')}>
        {/* Days of the week */}
        <div className="grid grid-cols-7 text-gray-500 font-bold text-xs">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="h-10 aspect-square flex items-center justify-center">{day}</div>
          ))}
        </div>

        {/* Days of the month */}
        <div className="grid grid-cols-7 font-regular">
          {datetime().range(startDate, endDate).map((date, index) => (
            <div key={index} className={twMerge(
              'h-10 aspect-square flex items-center justify-center relative',
              // 'hover:bg-black/5 cursor-pointer',
              Number(date.format('MM')) !== month ? 'text-gray-300' : ''
            )} onMouseEnter={() => { if (waitingForRangeEnd && (date.isAfter((value as DateRange)[0]) || date.isSame((value as DateRange)[0]))) setHoveringDate(date); }} onMouseLeave={() => setHoveringDate(null)}>
              {isRangePicker ? (
                <div
                  onClick={() => {
                    if (waitingForRangeEnd) {
                      if (date.isAfter(dateRange[0]) || date.isSame(dateRange[0])) {
                        setWaitingForRangeEnd(false);
                        setValue([dateRange[0], date]);
                        onChange?.([dateRange[0].toDateFormat(), date.toDateFormat()] as unknown as T);
                      }
                    } else {
                      setWaitingForRangeEnd(true);
                      setValue([date, date]);
                    }
                  }}
                  className={twMerge(
                    'h-9 relative aspect-square flex items-center justify-center border border-transparent cursor-pointer',

                    date.inPeriod(dateRange[0].toDateFormat(), dateRange[1].toDateFormat()) ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/20' : 'hover:bg-black/5',

                    // not allowed to select dates before the start date
                    waitingForRangeEnd && date.isBefore(dateRange[0]) ? 'cursor-not-allowed hover:bg-transparent' : '',

                    // rounded corners on hover
                    (date.inPeriod(dateRange[0].toDateFormat(), dateRange[1].toDateFormat(), 'day') || (waitingForRangeEnd && hoveringDate && date.inPeriod(dateRange[0].toDateFormat(), hoveringDate?.toDateFormat(), 'day'))) ? '' : 'rounded-xl',

                    date.isAfter(dateRange[0]) && date.isBefore(dateRange[1]) ? 'w-full  border-x-0 border-t-primary border-y-primary' : '',
                    date.isSame(dateRange[0]) ? 'w-full border-r-0 border-l-primary border-y-primary rounded-l-xl' : '',
                    date.isSame(dateRange[1]) && !waitingForRangeEnd ? 'w-full border-l-0 border-r-primary border-y-primary rounded-r-xl' : '',

                    // hovering date
                    waitingForRangeEnd && date.isAfter(dateRange[0]) && date.isBefore(hoveringDate) ? 'w-full  border-x-0 border-t-primary/70 border-y-primary/70' : '',
                    waitingForRangeEnd && date.isSame(hoveringDate) ? 'w-full border-l-0 border-r-primary/70 border-y-primary/70 rounded-r-xl' : '',

                    // hovering date is the start date
                    waitingForRangeEnd && date.isSame(dateRange[0]) && dateRange[0].isSame(hoveringDate) ? 'w-full border-x border-r-primary border-y-primary rounded-xl' : '',

                    // start and end date are the same
                    !waitingForRangeEnd && date.isSame(dateRange[0]) && dateRange[0].isSame(dateRange[1]) ? 'w-full border-x border-r-primary border-y-primary rounded-xl' : '',
                  )}
                >
                  <div className={twMerge(
                    'border-transparent',
                    // prevent text shift when border width is changed
                    waitingForRangeEnd && date.isSame(hoveringDate) ? 'border-l' : '',
                    waitingForRangeEnd && date.isSame(dateRange[0]) ? 'border-r' : '',
                    date.isSame(dateRange[0]) && !date.isSame(dateRange[1]) ? 'border-r' : '',
                    date.isSame(dateRange[1]) && !date.isSame(dateRange[0]) ? 'border-l' : '',
                  )}>
                    {date.format('D')}
                  </div>

                  {today && date.toDateFormat() === today && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
                  )}
                </div>
              ) : (
                <div
                  onClick={() => { setValue(date); onChange?.(date.toDateFormat() as unknown as T); }}
                  className={twMerge(
                    'relative rounded-xl h-9 aspect-square flex items-center justify-center border border-transparent',
                    (value as Datetime).toDateFormat() === date.toDateFormat() ? 'bg-primary/10 text-primary border-primary font-bold' : 'cursor-pointer hover:bg-black/5'
                  )}
                >
                  {date.format('D')}

                  {today && date.toDateFormat() === today && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

