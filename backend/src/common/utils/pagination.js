/**
 * Pagination helper
 */

function getPagination(page = 1, pageSize = 20) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
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
