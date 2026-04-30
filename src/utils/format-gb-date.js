/**
 * Formats a Date object as a UK English date string.
 *
 * Example: new Date(1990, 0, 15) → "15 January 1990"
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date in 'D MMMM YYYY' format
 */
export const formatGbDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
