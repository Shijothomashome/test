/**
 * Generates a URL-friendly slug from a string
 * @param {string} str - Input string to convert
 * @param {string} separator - Word separator (default: '-')
 * @returns {string} Generated slug
 */
export const generateSlug = (str, separator = '-') => {
  if (!str) return '';
  
  return str
    .toString() // Convert to string
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace
    .replace(/[^a-z0-9 ]/g, '') // Remove non-alphanumeric chars
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`${separator}{2,}`), separator) // Replace multiple separators
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Trim separators
};

// Example: generateSlug("Summer Collection 2023!") → "summer-collection-2023"