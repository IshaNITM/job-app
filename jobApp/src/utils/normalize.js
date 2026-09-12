/**
 * Normalizes a string by trimming whitespace and converting to lowercase.
 * Matches should be exact after this normalization.
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
export const normalizeStr = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase();
};
