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
