import React, { useState, useCallback, useEffect, useRef } from 'react';
import Calendar from './Calendar';
import {
  formatDate,
  parseDate,
  addMonths,
  addYears,
  getPresetRanges,
  startOfDay
} from '../utils/dateUtils';
import './DateRangePicker.css';

/**
 * DateRangePicker component with two calendars side by side
 * Similar to vue2-datepicker
 */
function DateRangePicker({
  value = [null, null],
  onChange,
  format = 'YYYY-MM-DD',
  placeholder = ['Start Date', 'End Date'],
  separator = ' ~ ',
  disabled = false,
  clearable = true,
  showPresets = true,
  presets: customPresets,
  minDate,
  maxDate,
  className = '',
  inputClassName = '',
  popupClassName = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value[0] ? new Date(value[0]) : null);
  const [endDate, setEndDate] = useState(value[1] ? new Date(value[1]) : null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(false); // true when selecting end date
  
  // Calendar view states
  const today = new Date();
  const [leftYear, setLeftYear] = useState(startDate?.getFullYear() || today.getFullYear());
  const [leftMonth, setLeftMonth] = useState(startDate?.getMonth() || today.getMonth());
  const [rightYear, setRightYear] = useState(() => {
    const nextMonth = addMonths(new Date(leftYear, leftMonth, 1), 1);
    return nextMonth.getFullYear();
  });
  const [rightMonth, setRightMonth] = useState(() => {
    const nextMonth = addMonths(new Date(leftYear, leftMonth, 1), 1);
    return nextMonth.getMonth();
  });

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Default presets
  const presets = customPresets || getPresetRanges();

  // Sync right calendar to be one month after left
  useEffect(() => {
    const nextMonth = addMonths(new Date(leftYear, leftMonth, 1), 1);
    setRightYear(nextMonth.getFullYear());
    setRightMonth(nextMonth.getMonth());
  }, [leftYear, leftMonth]);

  // Sync external value changes
  useEffect(() => {
    if (value[0]) setStartDate(new Date(value[0]));
    else setStartDate(null);
    if (value[1]) setEndDate(new Date(value[1]));
    else setEndDate(null);
  }, [value]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelecting(false);
        setHoverDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation handlers for left calendar
  const handleLeftPrevYear = useCallback(() => {
    setLeftYear((y) => y - 1);
  }, []);

  const handleLeftNextYear = useCallback(() => {
    setLeftYear((y) => y + 1);
  }, []);

  const handleLeftPrevMonth = useCallback(() => {
    const newDate = addMonths(new Date(leftYear, leftMonth, 1), -1);
    setLeftYear(newDate.getFullYear());
    setLeftMonth(newDate.getMonth());
  }, [leftYear, leftMonth]);

  const handleLeftNextMonth = useCallback(() => {
    const newDate = addMonths(new Date(leftYear, leftMonth, 1), 1);
    setLeftYear(newDate.getFullYear());
    setLeftMonth(newDate.getMonth());
  }, [leftYear, leftMonth]);

  // Navigation handlers for right calendar
  const handleRightPrevYear = useCallback(() => {
    const newDate = addYears(new Date(rightYear, rightMonth, 1), -1);
    // Ensure right calendar stays ahead of left
    const leftDate = new Date(leftYear, leftMonth, 1);
    if (newDate > leftDate) {
      setRightYear(newDate.getFullYear());
      setRightMonth(newDate.getMonth());
      // Update left calendar to stay one month behind
      const prevMonth = addMonths(newDate, -1);
      setLeftYear(prevMonth.getFullYear());
      setLeftMonth(prevMonth.getMonth());
    }
  }, [rightYear, rightMonth, leftYear, leftMonth]);

  const handleRightNextYear = useCallback(() => {
    const newDate = addYears(new Date(rightYear, rightMonth, 1), 1);
    setRightYear(newDate.getFullYear());
    setRightMonth(newDate.getMonth());
    // Update left calendar
    const prevMonth = addMonths(newDate, -1);
    setLeftYear(prevMonth.getFullYear());
    setLeftMonth(prevMonth.getMonth());
  }, [rightYear, rightMonth]);

  const handleRightPrevMonth = useCallback(() => {
    const newDate = addMonths(new Date(rightYear, rightMonth, 1), -1);
    const leftDate = new Date(leftYear, leftMonth, 1);
    if (newDate > leftDate) {
      setRightYear(newDate.getFullYear());
      setRightMonth(newDate.getMonth());
      // Update left calendar
      const prevMonth = addMonths(newDate, -1);
      setLeftYear(prevMonth.getFullYear());
      setLeftMonth(prevMonth.getMonth());
    }
  }, [rightYear, rightMonth, leftYear, leftMonth]);

  const handleRightNextMonth = useCallback(() => {
    const newDate = addMonths(new Date(rightYear, rightMonth, 1), 1);
    setRightYear(newDate.getFullYear());
    setRightMonth(newDate.getMonth());
    // Update left calendar
    const prevMonth = addMonths(newDate, -1);
    setLeftYear(prevMonth.getFullYear());
    setLeftMonth(prevMonth.getMonth());
  }, [rightYear, rightMonth]);

  // Date selection handler
  const handleDateClick = useCallback((date) => {
    if (!selecting) {
      // First click - set start date
      setStartDate(date);
      setEndDate(null);
      setSelecting(true);
    } else {
      // Second click - set end date
      let newStart = startDate;
      let newEnd = date;

      // Ensure start is before end
      if (date < startDate) {
        newStart = date;
        newEnd = startDate;
      }

      setStartDate(newStart);
      setEndDate(newEnd);
      setSelecting(false);
      setHoverDate(null);

      // Notify parent
      onChange?.([newStart, newEnd]);
      
      // Close the picker after selection
      setTimeout(() => setIsOpen(false), 150);
    }
  }, [selecting, startDate, onChange]);

  // Preset range click handler
  const handlePresetClick = useCallback((presetKey) => {
    const preset = presets[presetKey];
    if (preset) {
      setStartDate(preset.start);
      setEndDate(preset.end);
      setSelecting(false);
      
      // Update calendar view to show the selected range
      setLeftYear(preset.start.getFullYear());
      setLeftMonth(preset.start.getMonth());
      
      onChange?.([preset.start, preset.end]);
      
      // Close the picker
      setTimeout(() => setIsOpen(false), 150);
    }
  }, [presets, onChange]);

  // Clear handler
  const handleClear = useCallback((e) => {
    e.stopPropagation();
    setStartDate(null);
    setEndDate(null);
    setSelecting(false);
    onChange?.([null, null]);
  }, [onChange]);

  // Toggle picker
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  // Format display value
  const displayValue = (() => {
    if (startDate && endDate) {
      return `${formatDate(startDate, format)}${separator}${formatDate(endDate, format)}`;
    }
    if (startDate) {
      return `${formatDate(startDate, format)}${separator}${placeholder[1]}`;
    }
    return '';
  })();

  return (
    <div
      ref={containerRef}
      className={`date-range-picker ${className} ${disabled ? 'disabled' : ''}`}
    >
      {/* Input Field */}
      <div
        ref={inputRef}
        className={`picker-input ${inputClassName} ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
      >
        <input
          type="text"
          value={displayValue}
          placeholder={`${placeholder[0]}${separator}${placeholder[1]}`}
          readOnly
          disabled={disabled}
        />
        <div className="picker-input-icons">
          {clearable && (startDate || endDate) && (
            <span className="clear-icon" onClick={handleClear}>
              ×
            </span>
          )}
          <span className="calendar-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h5v5H7v-5z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className={`picker-popup ${popupClassName}`}>
          {/* Presets */}
          {showPresets && (
            <div className="picker-presets">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePresetClick(key)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Calendars */}
          <div className="picker-calendars">
            <Calendar
              year={leftYear}
              month={leftMonth}
              title="From"
              selectedDate={startDate}
              rangeStart={startDate}
              rangeEnd={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onPrevYear={handleLeftPrevYear}
              onNextYear={handleLeftNextYear}
              onPrevMonth={handleLeftPrevMonth}
              onNextMonth={handleLeftNextMonth}
              minDate={minDate}
              maxDate={maxDate}
            />
            <Calendar
              year={rightYear}
              month={rightMonth}
              title="To"
              selectedDate={endDate}
              rangeStart={startDate}
              rangeEnd={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onPrevYear={handleRightPrevYear}
              onNextYear={handleRightNextYear}
              onPrevMonth={handleRightPrevMonth}
              onNextMonth={handleRightNextMonth}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
