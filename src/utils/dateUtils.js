import { format, parseISO, isValid } from 'date-fns';

/**
 * Safely formats a date string to prevent errors with invalid dates
 * @param {string} dateString - The date string to format
 * @param {string} formatString - The format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string or fallback
 */
export const safeFormatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) {
    return format(new Date(), formatString);
  }
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return isValid(date) ? format(date, formatString) : format(new Date(), formatString);
  } catch (error) {
    console.error('Date formatting error:', error, 'for date:', dateString);
    return format(new Date(), formatString);
  }
};

/**
 * Safely parses ISO date string
 * @param {string} dateString - The date string to parse
 * @returns {Date} Valid Date object or current date as fallback
 */
export const safeParseISO = (dateString) => {
  if (!dateString) return new Date();
  
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : new Date();
  } catch (error) {
    console.error('Date parsing error:', error, 'for date:', dateString);
    return new Date();
  }
};

/**
 * Gets today's date in YYYY-MM-DD format for input fields
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayDateString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

/**
 * Validates if a string is a valid date
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if valid date
 */
export const isValidDateString = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
};