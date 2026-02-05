/**
 * Date utility functions for the date picker
 */

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
export const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the first day of the month (0 = Sunday, 6 = Saturday)
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is between two dates (inclusive)
 */
export function isDateInRange(date, startDate, endDate) {
  if (!date || !startDate || !endDate) return false;
  const time = date.getTime();
  return time >= startDate.getTime() && time <= endDate.getTime();
}

/**
 * Check if a date is today
 */
export function isToday(date) {
  return isSameDay(date, new Date());
}

/**
 * Format date to string
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString, format = 'YYYY-MM-DD') {
  if (!dateString) return null;
  
  const parts = dateString.split(/[-/]/);
  if (parts.length !== 3) return null;
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

/**
 * Add days to a date
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to a date
 */
export function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to a date
 */
export function addYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get calendar days for a month (including previous/next month days to fill the grid)
 */
export function getCalendarDays(year, month) {
  const days = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  // Previous month days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
      isPrevMonth: true,
      isNextMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      isPrevMonth: false,
      isNextMonth: false
    });
  }
  
  // Next month days
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(nextYear, nextMonth, i),
      isCurrentMonth: false,
      isPrevMonth: false,
      isNextMonth: true
    });
  }
  
  return days;
}

/**
 * Get the start of the day
 */
export function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get the end of the day
 */
export function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get the Financial Year start date (April 1st)
 * If the current date is before April, FY started in the previous year
 */
export function getFinancialYearStart(date) {
  const year = date.getMonth() < 3 ? date.getFullYear() - 1 : date.getFullYear();
  return new Date(year, 3, 1); // April 1st
}

/**
 * Get the Financial Year end date (March 31st)
 */
export function getFinancialYearEnd(date) {
  const year = date.getMonth() < 3 ? date.getFullYear() : date.getFullYear() + 1;
  return new Date(year, 2, 31); // March 31st
}

/**
 * Get the Previous Financial Year dates
 */
export function getPreviousFinancialYear(date) {
  const currentFYStart = getFinancialYearStart(date);
  const prevFYStart = addYears(currentFYStart, -1);
  const prevFYEnd = addDays(currentFYStart, -1);
  return { start: prevFYStart, end: prevFYEnd };
}

/**
 * Get the Current Financial Year dates
 */
export function getCurrentFinancialYear(date) {
  const start = getFinancialYearStart(date);
  const end = getFinancialYearEnd(date);
  return { start, end };
}

/**
 * Preset date ranges
 */
export function getPresetRanges() {
  const today = startOfDay(new Date());
  
  return {
    'last7Days': {
      label: 'last 7 days',
      start: addDays(today, -6),
      end: today
    },
    'last30Days': {
      label: 'last 30 days',
      start: addDays(today, -29),
      end: today
    },
    'prevFY': {
      label: 'prev. FY',
      ...getPreviousFinancialYear(today)
    },
    'currentFY': {
      label: 'current FY',
      ...getCurrentFinancialYear(today)
    }
  };
}
