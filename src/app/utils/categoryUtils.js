/**
 * Convert a category name to a URL-friendly slug
 * Converts to lowercase and replaces spaces/special chars with hyphens
 * Example: "Food & Beverage" -> "food-beverage"
 */
export function categoryToSlug(categoryName) {
  if (!categoryName) return '';
  
  return categoryName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert a slug back to a display name (capitalize first letter of each word)
 * Example: "food-beverage" -> "Food Beverage"
 */
export function slugToCategoryName(slug) {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
