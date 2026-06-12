const request = require('supertest');
const app = require('../../src/app');

let dbAvailable = true;

beforeAll(async () => {
  try {
    const { sequelize } = require('../../src/common/database/models');
    await sequelize.authenticate();
    dbAvailable = true;
  } catch (e) {
    dbAvailable = false;
  }
});

describe('Auth API', () => {
  describe('POST /api/v2/login', () => {
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/v2/login')
        .send({ password: 'TestPass123!' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.errcode).toBe(40000);
    });

    it('should return 401 for invalid credentials', async () => {
      if (!dbAvailable) {
        return; // Skip — requires PostgreSQL
      }

      const res = await request(app)
        .post('/api/v2/login')
        .send({ email: 'nonexistent@example.com', password: 'WrongPass123!' });

      expect(res.status).toBe(401);
      expect(res.body.errcode).toBe(40100);
    });
  });

  describe('POST /api/v2/register', () => {
    it('should return 400 for missing fields', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/v2/register')
        .send({ email: 'not-an-email', password: 'TestPass123!' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('GET /api/v2/profile without auth', () => {
    it('should return 401', async () => {
      const res = await request(app).get('/api/v2/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('404 for unknown routes', () => {
    it('should return 404', async () => {
      const res = await request(app).get('/api/v2/nonexistent');
      expect(res.status).toBe(404);
      expect(res.body.errcode).toBe(40400);
    });
  });
});
