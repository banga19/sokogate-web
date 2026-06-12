// ──────────────────────────────────────────────────────────────
// API Response Helpers — Unit Tests
// Pure functions — no mocking needed
// ──────────────────────────────────────────────────────────────

const {
  success,
  successPaginated,
  created,
  error,
} = require('../../src/common/utils/apiResponse');

/**
 * Creates a minimal mock Express response object.
 */
function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

// ──────────────────────────────────────────────────────────────
// success
// ──────────────────────────────────────────────────────────────
describe('success', () => {
  it('should return 200 with data and default message', () => {
    const res = mockRes();
    const result = success(res, { id: 1, name: 'test' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      errcode: 0,
      errmsg: 'success',
      data: { id: 1, name: 'test' },
    });
    expect(result).toBe(res);
  });

  it('should return 200 with null data when no data provided', () => {
    const res = mockRes();
    success(res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      errcode: 0,
      errmsg: 'success',
      data: null,
    });
  });

  it('should return 200 with custom message', () => {
    const res = mockRes();
    success(res, { key: 'value' }, 'Operation completed');

    expect(res.body.errmsg).toBe('Operation completed');
    expect(res.body.data).toEqual({ key: 'value' });
  });

  it('should return 200 with array data', () => {
    const res = mockRes();
    const items = [{ id: 1 }, { id: 2 }];
    success(res, items);

    expect(res.body.data).toEqual(items);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// successPaginated
// ──────────────────────────────────────────────────────────────
describe('successPaginated', () => {
  it('should return 200 with paginated structure using defaults', () => {
    const res = mockRes();
    const rows = [{ id: 1 }, { id: 2 }];
    successPaginated(res, rows, 100);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      errcode: 0,
      errmsg: 'success',
      data: {
        rows,
        total: 100,
        page: 1,
        pageSize: 20,
      },
    });
  });

  it('should return 200 with custom page and pageSize', () => {
    const res = mockRes();
    const rows = [{ id: 1 }];
    successPaginated(res, rows, 50, 3, 10);

    expect(res.body.data).toEqual({
      rows,
      total: 50,
      page: 3,
      pageSize: 10,
    });
  });

  it('should return 200 with empty rows array', () => {
    const res = mockRes();
    successPaginated(res, [], 0);

    expect(res.body.data.rows).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────
// created
// ──────────────────────────────────────────────────────────────
describe('created', () => {
  it('should return 201 with data and default message', () => {
    const res = mockRes();
    const newItem = { id: 'new-uuid', name: 'New Item' };
    created(res, newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      errcode: 0,
      errmsg: 'Created successfully',
      data: newItem,
    });
  });

  it('should return 201 with null data when no data provided', () => {
    const res = mockRes();
    created(res);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toBeNull();
  });

  it('should return 201 with custom message', () => {
    const res = mockRes();
    created(res, { id: 1 }, 'User registered');

    expect(res.body.errmsg).toBe('User registered');
  });
});

// ──────────────────────────────────────────────────────────────
// error
// ──────────────────────────────────────────────────────────────
describe('error', () => {
  it('should return 500 with default error code and message', () => {
    const res = mockRes();
    error(res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      errcode: 50000,
      errmsg: 'Internal server error',
      data: null,
    });
  });

  it('should return custom status code, error code, and message', () => {
    const res = mockRes();
    error(res, 40400, 'Resource not found', 404);

    expect(res.statusCode).toBe(404);
    expect(res.body.errcode).toBe(40400);
    expect(res.body.errmsg).toBe('Resource not found');
  });

  it('should return 400 with validation error', () => {
    const res = mockRes();
    error(res, 40000, 'Email is required', 400);

    expect(res.statusCode).toBe(400);
    expect(res.body.errcode).toBe(40000);
  });

  it('should return 429 with rate limit error', () => {
    const res = mockRes();
    error(res, 42900, 'Too many requests', 429);

    expect(res.statusCode).toBe(429);
    expect(res.body.errcode).toBe(42900);
  });

  it('should always have data as null', () => {
    const res = mockRes();
    error(res, 40300, 'Forbidden', 403);

    expect(res.body.data).toBeNull();
  });
});
