/**
 * Date utility functions for formatting and parsing dates
 */

/**
 * Format date from ISO string to dd/mm/yyyy
 */
export const formatDateToDDMMYYYY = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format date to yyyy-MM-dd for input[type="date"]
 */
export const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Parse dd/mm/yyyy to ISO string
 */
export const parseDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return '';
  
  const date = new Date(year, month, day);
  return date.toISOString();
};

/**
 * Validate dd/mm/yyyy format
 */
export const isValidDDMMYYYY = (dateString: string): boolean => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  // Check valid ranges
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Check valid date
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
};
