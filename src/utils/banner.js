/**
 * Banner utility functions
 *
 * Shared logic for normalizing banner API responses across all banner components.
 * Handles the common task of extracting and normalizing banner data from the API
 * response format, including image_url → image field normalization.
 */

/**
 * Normalize a banner API response into a consistent array of banner objects.
 *
 * Handles:
 * - Response as a direct array:  { data: [...] }
 * - Response as { rows } object: { data: { rows: [...] } }
 * - Any falsy/missing data gracefully
 *
 * Each banner object gets an `image` field populated via:
 *   banner.image || banner.image_url || ''
 *
 * @param {Object} res - The API response object (with .data property)
 * @returns {Array} Normalized array of banner objects
 */
export function normalizeBannerList(res) {
  const rawData = res && res.data;
  const rawList = Array.isArray(rawData) ? rawData : (rawData && rawData.rows) || [];
  return rawList.map((banner) => ({
    ...banner,
    image: banner.image || banner.image_url || '',
  }));
}
