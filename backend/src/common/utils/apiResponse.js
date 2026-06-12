/**
 * Standardized API response helpers
 */

function success(res, data = null, message = 'success') {
  return res.status(200).json({
    errcode: 0,
    errmsg: message,
    data,
  });
}

function successPaginated(res, rows, total, page = 1, pageSize = 20) {
  return res.status(200).json({
    errcode: 0,
    errmsg: 'success',
    data: {
      rows,
      total,
      page,
      pageSize,
    },
  });
}

function created(res, data = null, message = 'Created successfully') {
  return res.status(201).json({
    errcode: 0,
    errmsg: message,
    data,
  });
}

function error(res, errcode = 50000, message = 'Internal server error', statusCode = 500) {
  return res.status(statusCode).json({
    errcode,
    errmsg: message,
    data: null,
  });
}

module.exports = {
  success,
  successPaginated,
  created,
  error,
};
