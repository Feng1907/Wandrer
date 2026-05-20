'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Props {
  startDate: string;   // yyyy-mm-dd
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
  startLabel?: string;
  endLabel?: string;
  minDate?: string;
}

const DAYS_VI = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

function toYMD(d: Date) {
  return d.toISOString().split('T')[0];
}

function parseYMD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(s: string) {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun,1=Mon,...6=Sat → convert to Mon-first: Mon=0..Sun=6
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

interface MonthGridProps {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  hoverDate: string;
  onDayClick: (d: string) => void;
  onDayHover: (d: string) => void;
  minDate: string;
}

function MonthGrid({ year, month, startDate, endDate, hoverDate, onDayClick, onDayHover, minDate }: MonthGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  // pad to complete rows
  while (cells.length % 7 !== 0) cells.push(null);

  const rangeEnd = hoverDate && (!endDate || (startDate && !endDate)) ? hoverDate : endDate;

  return (
    <div className="min-w-[280px]">
      <p className="mb-3 text-center text-sm font-bold text-neutral-800">
        Tháng {month + 1} năm {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_VI.map((d, i) => (
          <div key={d} className={`text-center text-xs font-semibold py-1 ${i === 6 ? 'text-red-500' : 'text-neutral-500'}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isStart = dateStr === startDate;
          const isEnd = dateStr === endDate;
          const inRange = startDate && rangeEnd && dateStr > startDate && dateStr < rangeEnd;
          const isDisabled = minDate ? dateStr < minDate : false;
          const isSun = (firstDay + day - 1) % 7 === 6;

          return (
            <div
              key={idx}
              onClick={() => !isDisabled && onDayClick(dateStr)}
              onMouseEnter={() => !isDisabled && onDayHover(dateStr)}
              className={`
                relative flex h-9 items-center justify-center text-sm cursor-pointer select-none
                ${isDisabled ? 'cursor-not-allowed opacity-30' : ''}
                ${inRange ? 'bg-blue-50' : ''}
                ${isStart ? 'rounded-l-full' : ''}
                ${isEnd ? 'rounded-r-full' : ''}
              `}
            >
              <span className={`
                flex h-8 w-8 items-center justify-center rounded-full transition-colors
                ${isStart || isEnd ? 'bg-blue-600 text-white font-bold' : ''}
                ${!isStart && !isEnd && !isDisabled ? (isSun ? 'text-red-500 hover:bg-neutral-100' : 'text-neutral-700 hover:bg-neutral-100') : ''}
              `}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangePicker({ startDate, endDate, onRangeChange, startLabel = 'Ngày đi', endLabel = 'Ngày về', minDate = '' }: Props) {
  const today = toYMD(new Date());
  const effectiveMin = minDate || today;

  const initMonth = startDate ? parseYMD(startDate) : new Date();
  const [leftYear, setLeftYear]   = useState(initMonth.getFullYear());
  const [leftMonth, setLeftMonth] = useState(initMonth.getMonth());
  const [hoverDate, setHoverDate] = useState('');
  const [open, setOpen]           = useState(false);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd]     = useState(endDate);
  const ref = useRef<HTMLDivElement>(null);

  const rightYear  = leftMonth === 11 ? leftYear + 1 : leftYear;
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDayClick = (d: string) => {
    if (selecting === 'start' || (tempStart && d < tempStart)) {
      setTempStart(d);
      setTempEnd('');
      setSelecting('end');
    } else {
      setTempEnd(d);
      setSelecting('start');
      onRangeChange(tempStart, d);
      setOpen(false);
    }
  };

  const prevMonth = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(y => y - 1); }
    else setLeftMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(y => y + 1); }
    else setLeftMonth(m => m + 1);
  };

  const openPicker = (which: 'start' | 'end') => {
    setSelecting(which);
    setTempStart(startDate);
    setTempEnd(endDate);
    setOpen(true);
  };

  return (
    <div ref={ref} className="relative flex">
      {/* Start date trigger */}
      <div
        onClick={() => openPicker('start')}
        className="flex w-36 shrink-0 cursor-pointer flex-col justify-center border-l border-neutral-100 px-4 py-3 hover:bg-neutral-50 transition-colors"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 flex items-center gap-0.5">
          <Calendar className="h-3 w-3" /> {startLabel}
        </p>
        <p className={`text-sm font-bold ${startDate ? 'text-blue-600' : 'text-neutral-400'}`}>
          {startDate ? formatDisplay(startDate) : 'dd/mm/yyyy'}
        </p>
      </div>

      {/* End date trigger */}
      <div
        onClick={() => openPicker('end')}
        className="flex w-36 shrink-0 cursor-pointer flex-col justify-center border-l border-neutral-100 px-4 py-3 hover:bg-neutral-50 transition-colors"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5 flex items-center gap-0.5">
          <Calendar className="h-3 w-3" /> {endLabel}
        </p>
        <p className={`text-sm font-bold ${endDate ? 'text-blue-600' : 'text-neutral-400'}`}>
          {endDate ? formatDisplay(endDate) : 'dd/mm/yyyy'}
        </p>
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div className="absolute right-0 bottom-full z-50 mb-2 rounded-2xl border border-neutral-100 bg-white p-5 shadow-2xl"
          style={{ minWidth: 620 }}>
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
              <ChevronLeft className="h-4 w-4 text-neutral-500" />
            </button>
            <div className="flex flex-1 justify-around" />
            <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            </button>
          </div>

          <div className="flex gap-8">
            <MonthGrid year={leftYear} month={leftMonth}
              startDate={tempStart} endDate={tempEnd}
              hoverDate={hoverDate}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
              minDate={effectiveMin} />
            <div className="w-px bg-neutral-100 self-stretch" />
            <MonthGrid year={rightYear} month={rightMonth}
              startDate={tempStart} endDate={tempEnd}
              hoverDate={hoverDate}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
              minDate={effectiveMin} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
            <p className="text-xs text-neutral-400">
              {selecting === 'start' ? 'Chọn ngày bắt đầu' : 'Chọn ngày kết thúc'}
            </p>
            <button onClick={() => { setTempStart(''); setTempEnd(''); setSelecting('start'); }}
              className="text-xs text-blue-600 hover:underline">
              Xóa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
