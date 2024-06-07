/**
 * Validates a date string in the format "YYYY-MM-DD".
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} - Returns true if the date string is valid, otherwise false.
 */
function validateDate(date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    return false;
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  const dateObj = new Date(year, month, day);

  // Check that the date object is the same date (this will catch things like 30 Feb)
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month &&
    dateObj.getDate() === day
  );
}

/**
 * Validates a date range.
 *
 * @param {string} from - The start date string to validate.
 * @param {string} to - The end date string to validate.
 * @returns {boolean} - Returns true if the date range is valid, otherwise false.
 */
function validateDateRange(from, to) {
  if (!validateDate(from) || !validateDate(to)) {
    return false;
  }

  // Validate date range
  const fromDate = new Date(from);
  const toDate = new Date(to);

  return fromDate <= toDate;
}

module.exports = {
  validateDate,
  validateDateRange,
};
