import React, { useMemo } from 'react';
import {
  DAYS,
  MONTHS,
  getCalendarDays,
  isSameDay,
  isDateInRange,
  isToday
} from '../utils/dateUtils';

/**
 * Calendar component that displays a single month view
 */
function Calendar({
  year,
  month,
  title,
  selectedDate,
  rangeStart,
  rangeEnd,
  hoverDate,
  onDateClick,
  onDateHover,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  minDate,
  maxDate
}) {
  const calendarDays = useMemo(() => {
    return getCalendarDays(year, month);
  }, [year, month]);

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getDayClasses = (dayInfo) => {
    const { date, isCurrentMonth } = dayInfo;
    const classes = ['calendar-day'];

    if (!isCurrentMonth) {
      classes.push('other-month');
    }

    if (isDateDisabled(date)) {
      classes.push('disabled');
    }

    if (isToday(date)) {
      classes.push('today');
    }

    // Check if this is the selected date
    if (isSameDay(date, selectedDate)) {
      classes.push('selected');
    }

    // Check if this is the range start or end
    if (isSameDay(date, rangeStart)) {
      classes.push('range-start');
    }

    if (isSameDay(date, rangeEnd)) {
      classes.push('range-end');
    }

    // Check if date is in the selected range
    if (rangeStart && rangeEnd && isDateInRange(date, rangeStart, rangeEnd)) {
      classes.push('in-range');
    }

    // Check if date is in the hover range (when selecting)
    if (rangeStart && !rangeEnd && hoverDate) {
      const hoverRangeStart = rangeStart < hoverDate ? rangeStart : hoverDate;
      const hoverRangeEnd = rangeStart < hoverDate ? hoverDate : rangeStart;
      if (isDateInRange(date, hoverRangeStart, hoverRangeEnd)) {
        classes.push('in-hover-range');
      }
    }

    return classes.join(' ');
  };

  const handleDayClick = (dayInfo) => {
    if (!dayInfo.isCurrentMonth || isDateDisabled(dayInfo.date)) return;
    onDateClick?.(dayInfo.date);
  };

  const handleDayHover = (dayInfo) => {
    if (!dayInfo.isCurrentMonth || isDateDisabled(dayInfo.date)) {
      onDateHover?.(null);
      return;
    }
    onDateHover?.(dayInfo.date);
  };

  return (
    <div className="calendar">
      {/* Calendar Header with Title */}
      <div className="calendar-header">
        <span className="calendar-title">{title}</span>
      </div>

      {/* Navigation */}
      <div className="calendar-nav">
        <button
          type="button"
          className="nav-btn"
          onClick={onPrevYear}
          title="Previous Year"
        >
          «
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={onPrevMonth}
          title="Previous Month"
        >
          ‹
        </button>
        <span className="calendar-month-year">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          className="nav-btn"
          onClick={onNextMonth}
          title="Next Month"
        >
          ›
        </button>
        <button
          type="button"
          className="nav-btn"
          onClick={onNextYear}
          title="Next Year"
        >
          »
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="calendar-weekdays">
        {DAYS.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="calendar-days">
        {calendarDays.map((dayInfo, index) => (
          <div
            key={index}
            className={getDayClasses(dayInfo)}
            onClick={() => handleDayClick(dayInfo)}
            onMouseEnter={() => handleDayHover(dayInfo)}
            onMouseLeave={() => onDateHover?.(null)}
          >
            {dayInfo.date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
