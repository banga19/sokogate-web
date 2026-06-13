// ──────────────────────────────────────────────────────────────
// Metrics Middleware — Unit Tests
// Tests the Prometheus metrics middleware functionality.
// ──────────────────────────────────────────────────────────────

const mockHistogram = {
  startTimer: jest.fn().mockReturnValue(jest.fn()),
  observe: jest.fn(),
};

const mockCounter = {
  inc: jest.fn(),
};

const mockRegister = {
  metrics: jest.fn().mockResolvedValue('# HELP mock metric\n# TYPE mock gauge\nmock_metric 1\n'),
  contentType: 'text/plain; charset=utf-8',
};

jest.mock('prom-client', () => ({
  collectDefaultMetrics: jest.fn(),
  Histogram: jest.fn().mockReturnValue(mockHistogram),
  Counter: jest.fn().mockReturnValue(mockCounter),
  register: mockRegister,
}));

const { metricsMiddleware, getMetrics, isAvailable } = require('../../src/common/middleware/metrics.middleware');

// ──────────────────────────────────────────────────────────────
// metricsMiddleware
// ──────────────────────────────────────────────────────────────
describe('metricsMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() and set up response finish listener', () => {
    const req = { method: 'GET', path: '/test', route: { path: '/test' } };
    const res = { on: jest.fn(), statusCode: 200 };
    const next = jest.fn();

    metricsMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(mockHistogram.startTimer).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should record metrics when response finishes', () => {
    const req = { method: 'POST', path: '/api/v2/login', route: { path: '/api/v2/login' } };
    const endTimer = jest.fn();
    mockHistogram.startTimer.mockReturnValue(endTimer);

    let finishCb;
    const res = {
      on: jest.fn((event, cb) => { if (event === 'finish') finishCb = cb; }),
      statusCode: 201,
    };
    const next = jest.fn();

    metricsMiddleware(req, res, next);

    // Simulate response finish
    res.statusCode = 201;
    finishCb();

    expect(endTimer).toHaveBeenCalledWith({
      method: 'POST',
      route: '/api/v2/login',
      status: 201,
    });
    expect(mockCounter.inc).toHaveBeenCalledWith({
      method: 'POST',
      route: '/api/v2/login',
      status: 201,
    });
  });

  it('should use req.path as fallback when req.route is undefined', () => {
    const req = { method: 'GET', path: '/health' };
    const endTimer = jest.fn();
    mockHistogram.startTimer.mockReturnValue(endTimer);

    let finishCb;
    const res = {
      on: jest.fn((event, cb) => { if (event === 'finish') finishCb = cb; }),
      statusCode: 200,
    };
    const next = jest.fn();

    metricsMiddleware(req, res, next);

    res.statusCode = 200;
    finishCb();

    expect(endTimer).toHaveBeenCalledWith({
      method: 'GET',
      route: '/health',
      status: 200,
    });
  });
});

// ──────────────────────────────────────────────────────────────
// isAvailable
// ──────────────────────────────────────────────────────────────
describe('isAvailable', () => {
  it('should return true when prom-client was initialized', () => {
    expect(isAvailable()).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// getMetrics
// ──────────────────────────────────────────────────────────────
describe('getMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return prometheus metrics string', async () => {
    const metrics = await getMetrics();

    expect(mockRegister.metrics).toHaveBeenCalled();
    expect(metrics).toContain('mock_metric');
  });
});

// ──────────────────────────────────────────────────────────────
// Fallback behavior (isolated module)
// ──────────────────────────────────────────────────────────────
describe('when prom-client is unavailable', () => {
  it('should return fallback string from getMetrics', () => {
    jest.isolateModules(() => {
      jest.mock('prom-client', () => { throw new Error('not available'); });
      const fallbackMetrics = require('../../src/common/middleware/metrics.middleware');

      // getMetrics should handle gracefully
      return fallbackMetrics.getMetrics().then((metrics) => {
        expect(metrics).toBe('# Prometheus client not available\n');
      });
    });
  });

  it('should call next() without crashing in middleware', () => {
    jest.isolateModules(() => {
      jest.mock('prom-client', () => { throw new Error('not available'); });
      const { metricsMiddleware: fallbackMw } = require('../../src/common/middleware/metrics.middleware');

      const req = { method: 'GET', path: '/test' };
      const res = { on: jest.fn() };
      const next = jest.fn();

      fallbackMw(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
