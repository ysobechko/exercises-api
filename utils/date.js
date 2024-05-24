/**
 * Validates a date string in the format "YYYY-MM-DD".
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} - Returns true if the date string is valid, otherwise false.
 */
function validateDate(date) {
  return /^(\d{4})-(\d{2})-(\d{2})$/.test(date);
}

module.exports = {
  validateDate,
};
