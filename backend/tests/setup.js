// Set test environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5433';
process.env.DB_NAME = 'sokogate_test';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6380';
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-only';
process.env.CORS_ORIGIN = 'http://localhost:4500';
process.env.LOG_LEVEL = 'silent';
process.env.FLUTTERWAVE_SECRET_KEY = 'FLWSECK_TEST-test-secret-key-for-integration-tests';
process.env.FLUTTERWAVE_SECRET_HASH = 'test-webhook-hash-123';
