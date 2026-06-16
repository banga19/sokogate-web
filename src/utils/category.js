/**
 * Recursively map backend category `name` → frontend `categoryName`
 * required by nav components.
 *
 * Backend returns:  { id, name, slug, icon_url, children }
 * Frontend expects: { id, categoryName, slug, icon_url, children }
 */
export const mapCategory = (cat) => ({
  ...cat,
  categoryName: cat.name || cat.categoryName,
  children: (cat.children || []).map(mapCategory),
})

/**
 * Normalize static category data to match the API response format.
 *
 * The static file uses `name: 'category.Electronics'` (i18n key prefix included).
 * This strips the 'category.' prefix recursively so it matches the API's name format
 * and can be processed through mapCategory().
 *
 * Static data:    { name: 'category.Electronics', children: [{ name: 'category.all', ... }] }
 * After normalize: { name: 'Electronics', children: [{ name: 'all', ... }] }
 * After mapCategory: { categoryName: 'Electronics', children: [{ categoryName: 'all', ... }] }
 */
export function normalizeStaticCategory(cat) {
  if (Array.isArray(cat)) {
    return cat.map(normalizeStaticCategory);
  }
  const result = { ...cat };
  // Strip 'category.' prefix to match API's name format
  if (typeof result.name === 'string' && result.name.startsWith('category.')) {
    result.name = result.name.slice(9);
  }
  if (Array.isArray(result.children)) {
    result.children = result.children.map(normalizeStaticCategory);
  }
  return result;
}
