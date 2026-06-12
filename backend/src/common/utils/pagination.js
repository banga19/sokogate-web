/**
 * Pagination helper
 */

function getPagination(page = 1, pageSize = 20) {
  const parsedPage = parseInt(page, 10);
  const p = Math.max(1, isNaN(parsedPage) ? 1 : parsedPage);

  const parsedSize = parseInt(pageSize, 10);
  const ps = isNaN(parsedSize)
    ? 20
    : Math.min(100, Math.max(1, parsedSize));

  const offset = (p - 1) * ps;

  return {
    page: p,
    pageSize: ps,
    offset,
    limit: ps,
  };
}

function getPagingMeta(total, page, pageSize) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

module.exports = {
  getPagination,
  getPagingMeta,
};
