// Export components for library usage
export { default as DateRangePicker } from './components/DateRangePicker';
export { default as Calendar } from './components/Calendar';

// Export utility functions
export {
  DAYS,
  MONTHS,
  FULL_MONTHS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isDateInRange,
  isToday,
  formatDate,
  parseDate,
  addDays,
  addMonths,
  addYears,
  getCalendarDays,
  startOfDay,
  endOfDay,
  getFinancialYearStart,
  getFinancialYearEnd,
  getPreviousFinancialYear,
  getCurrentFinancialYear,
  getPresetRanges
} from './utils/dateUtils';
