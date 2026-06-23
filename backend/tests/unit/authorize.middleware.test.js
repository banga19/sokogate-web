// ──────────────────────────────────────────────────────────────
// requireResourceOwner Middleware — Unit Tests
//
// Tests the resource ownership authorization middleware:
//   - Factory returns a middleware function (not a Promise)
//   - Validates resource ID existence
//   - Verifies resource existence
//   - Checks ownership (owner passes, non-owner blocked)
//   - Admin bypass (admin can access any resource)
//   - Error handling
// ──────────────────────────────────────────────────────────────

const { requireResourceOwner } = require('../../src/common/middleware/authorize.middleware');
const { NotFoundError, ForbiddenError } = require('../../src/common/utils/errors');

// ──────────────────────────────────────────────────────────────
// Shared test helpers
// ──────────────────────────────────────────────────────────────

function mockReq(body = {}, params = {}, user = null) {
  return { body, params, user };
}

function mockRes() {
  // We just need next() to be spied — res is unused by this middleware
  return {};
}

function mockNext() {
  return jest.fn();
}

/**
 * Create a mock Sequelize model with a spy on findByPk.
 */
function mockModel(findByPkResult) {
  return {
    findByPk: jest.fn().mockResolvedValue(findByPkResult),
  };
}

// ──────────────────────────────────────────────────────────────
// Factory: requireResourceOwner returns a middleware function
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner factory', () => {
  it('should return a function (not a Promise)', () => {
    const ResourceModel = { findByPk: jest.fn() };
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');

    // This is the key regression test: the factory must return
    // a middleware synchronously, NOT a Promise<middleware>.
    // Express route registration (router.post(...)) requires
    // a function; receiving a Promise causes:
    //   "Route.post() requires a callback function but got a [object Promise]"
    expect(typeof middleware).toBe('function');
    expect(middleware.constructor.name).toBe('AsyncFunction'); // It IS async internally
  });

  it('should apply default parameter names', async () => {
    const ResourceModel = { findByPk: jest.fn().mockResolvedValue({ user_id: 'user-1' }) };
    const middleware = requireResourceOwner(ResourceModel);

    expect(typeof middleware).toBe('function');

    // With defaults: idParam='id', userIdField='user_id'
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('resource-1', { paranoid: false });
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: missing resource ID
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — missing resource ID', () => {
  it('should call next with NotFoundError when id is missing from body', async () => {
    const ResourceModel = { findByPk: jest.fn() };
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({}, {}, { id: 'user-1' }); // no 'id' in body or params
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new NotFoundError('Resource ID is required'));
  });

  it('should look for id in req.params when not in body', async () => {
    const ResourceModel = { findByPk: jest.fn().mockResolvedValue({ user_id: 'user-1' }) };
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({}, { id: 'resource-1' }, { id: 'user-1' }); // id in params
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('resource-1', { paranoid: false });
    expect(next).toHaveBeenCalledWith(); // passed through
  });

  it('should use custom idParam name from body', async () => {
    const ResourceModel = { findByPk: jest.fn().mockResolvedValue({ owner_id: 'user-1' }) };
    const middleware = requireResourceOwner(ResourceModel, 'orderId', 'owner_id');
    const req = mockReq({ orderId: 'order-1' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('order-1', { paranoid: false });
  });

  it('should use custom idParam name from params', async () => {
    const ResourceModel = { findByPk: jest.fn().mockResolvedValue({ owner_id: 'user-1' }) };
    const middleware = requireResourceOwner(ResourceModel, 'orderId', 'owner_id');
    const req = mockReq({}, { orderId: 'order-2' }, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('order-2', { paranoid: false });
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: resource not found
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — resource not found', () => {
  it('should call next with NotFoundError when resource is null', async () => {
    const ResourceModel = mockModel(null); // findByPk resolves to null
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'nonexistent' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('nonexistent', { paranoid: false });
    expect(next).toHaveBeenCalledWith(new NotFoundError('Resource not found'));
  });

  it('should call next with NotFoundError when resource is undefined', async () => {
    const ResourceModel = mockModel(undefined);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'ghost' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(new NotFoundError('Resource not found'));
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: owner access
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — owner access', () => {
  it('should call next() without arguments when user owns the resource', async () => {
    const resource = { user_id: 'user-1' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(); // no arguments = pass through
  });

  it('should match custom userIdField', async () => {
    const resource = { owner_id: 'user-42' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'owner_id');
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'user-42' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: non-owner blocked
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — non-owner blocked', () => {
  it('should call next with ForbiddenError when user is not the owner', async () => {
    const resource = { user_id: 'user-owner' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'user-attacker' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(
      new ForbiddenError('You do not have permission to access this resource')
    );
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: admin bypass
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — admin bypass', () => {
  it('should allow admin to access any resource', async () => {
    const resource = { user_id: 'user-owner' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'admin-1', role: 'admin' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(); // admin bypasses ownership check
  });

  it('should still check resource existence for admin', async () => {
    const ResourceModel = mockModel(null); // resource doesn't exist
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'nonexistent' }, {}, { id: 'admin-1', role: 'admin' });
    const next = mockNext();

    await middleware(req, {}, next);

    // Admin still needs the resource to exist
    expect(next).toHaveBeenCalledWith(new NotFoundError('Resource not found'));
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: error handling
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — error handling', () => {
  it('should call next with error when findByPk throws', async () => {
    const dbError = new Error('Database connection failed');
    const ResourceModel = {
      findByPk: jest.fn().mockRejectedValue(dbError),
    };
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq({ id: 'resource-1' }, {}, { id: 'user-1' });
    const next = mockNext();

    await middleware(req, {}, next);

    expect(next).toHaveBeenCalledWith(dbError);
  });
});

// ──────────────────────────────────────────────────────────────
// Middleware: parameter name symmetry
// ──────────────────────────────────────────────────────────────
describe('requireResourceOwner — parameter symmetry', () => {
  it('should check req.params before req.body (params priority)', async () => {
    const resource = { user_id: 'user-1' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    const req = mockReq(
      { id: 'body-id' },
      { id: 'params-id' },
      { id: 'user-1' }
    );
    const next = mockNext();

    await middleware(req, {}, next);

    // Middleware checks req.params[idParam] || req.body[idParam]
    // so params takes priority over body
    expect(ResourceModel.findByPk).toHaveBeenCalledWith('params-id', { paranoid: false });
  });

  it('should use req.params when req.body has no matching field', async () => {
    const resource = { user_id: 'user-1' };
    const ResourceModel = mockModel(resource);
    const middleware = requireResourceOwner(ResourceModel, 'id', 'user_id');
    // id is in params, not body
    const req = { body: {}, params: { id: 'params-id' }, user: { id: 'user-1' } };
    const next = mockNext();

    await middleware(req, {}, next);

    expect(ResourceModel.findByPk).toHaveBeenCalledWith('params-id', { paranoid: false });
  });
});
