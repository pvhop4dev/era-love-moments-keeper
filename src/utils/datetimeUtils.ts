/**
 * Utility functions for datetime formatting and conversion
 * Ensures consistent datetime format between frontend and backend
 */

/**
 * Convert a date string (YYYY-MM-DD) and optional time (HH:MM) to RFC3339 format
 * Backend expects RFC3339 format: "2006-01-02T15:04:05Z07:00"
 * 
 * @param dateStr - Date string in format YYYY-MM-DD
 * @param timeStr - Optional time string in format HH:MM
 * @returns ISO 8601 / RFC3339 formatted datetime string with timezone (e.g., "2025-11-06T12:00:00.000Z")
 */
export const formatDateTimeForBackend = (dateStr: string, timeStr?: string): string => {
  const dateObj = new Date(dateStr);
  
  if (timeStr) {
    const [hours, minutes] = timeStr.split(':');
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  } else {
    // If no time provided, use noon to avoid timezone issues
    dateObj.setHours(12, 0, 0, 0);
  }
  
  // toISOString() returns RFC3339 format with Z timezone
  return dateObj.toISOString();
};

/**
 * Convert a Date object to RFC3339 format for backend
 * 
 * @param date - JavaScript Date object
 * @returns ISO 8601 / RFC3339 formatted datetime string
 */
export const formatDateObjectForBackend = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse backend datetime string to Date object
 * Backend returns RFC3339 format
 * 
 * @param dateTimeStr - RFC3339 datetime string from backend
 * @returns JavaScript Date object
 */
export const parseDateTimeFromBackend = (dateTimeStr: string): Date => {
  return new Date(dateTimeStr);
};

/**
 * Extract date part (YYYY-MM-DD) from backend datetime string
 * 
 * @param dateTimeStr - RFC3339 datetime string from backend
 * @returns Date string in format YYYY-MM-DD
 */
export const extractDateFromBackend = (dateTimeStr: string): string => {
  return new Date(dateTimeStr).toISOString().split('T')[0];
};

/**
 * Extract time part (HH:MM) from backend datetime string
 * 
 * @param dateTimeStr - RFC3339 datetime string from backend
 * @returns Time string in format HH:MM
 */
export const extractTimeFromBackend = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format date for display (locale-aware)
 * 
 * @param dateTimeStr - RFC3339 datetime string from backend
 * @param locale - Optional locale (default: user's locale)
 * @returns Formatted date string
 */
export const formatDateForDisplay = (dateTimeStr: string, locale?: string): string => {
  return new Date(dateTimeStr).toLocaleDateString(locale);
};

/**
 * Format datetime for display (locale-aware)
 * 
 * @param dateTimeStr - RFC3339 datetime string from backend
 * @param locale - Optional locale (default: user's locale)
 * @returns Formatted datetime string
 */
export const formatDateTimeForDisplay = (dateTimeStr: string, locale?: string): string => {
  return new Date(dateTimeStr).toLocaleString(locale);
};
