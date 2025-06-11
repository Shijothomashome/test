/**
 * Generates a SKU (Stock Keeping Unit) for product variants
 * @param {string} productName - Base product name
 * @param {Array} attributes - Variant attributes (e.g., [{name: "Color", value: "Red"}, ...])
 * @param {number} length - Max SKU length (default: 12)
 * @returns {string} Generated SKU
 */
export const generateSKU = (productName, attributes = [], length = 12) => {
  // Extract initials from product name
  const namePart = productName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();

  // Extract codes from variant attributes
  const variantPart = attributes
    .map(attr => {
      if (!attr.value) return '';
      // Use first 2 letters of attribute name + first 2 letters of value
      return `${attr.name.substring(0, 2)}${attr.value.substring(0, 2)}`.toUpperCase();
    })
    .join('');

  // Combine and truncate
  let sku = `${namePart}-${variantPart}`.replace(/[^A-Z0-9-]/g, '');

  // Add timestamp if too short
  if (sku.length < 5) {
    sku += `-${Date.now().toString().slice(-4)}`;
  }

  // Ensure length limit
  return sku.substring(0, length);
};

// Example: generateSKU("T-Shirt", [{name: "Color", value: "Red"}, {name: "Size", value: "XL"}])
// Output: "TS-CORE-SIXL"