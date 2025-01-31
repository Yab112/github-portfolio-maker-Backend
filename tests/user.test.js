import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import { setupDB, teardownDB, clearDB } from './helpers';

describe('User System', () => {
  let authCookie;

  beforeAll(async () => {
    await setupDB();
    await User.create({
      username: 'testuser',
      email: 'user@example.com',
      password: 'Password123!',
      isVerified: true
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@example.com',
        password: 'Password123!'
      });

    authCookie = loginRes.headers['set-cookie'];
  });

  afterAll(async () => await teardownDB());
  afterEach(async () => await clearDB());

  describe('GET /api/v1/users/me', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Cookie', authCookie)
        .expect(200);

      console.log('Response:', response.body);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('user@example.com');
      expect(response.body.data.username).toBe('testuser');
      expect(response.body.data.password).toBeUndefined(); // Ensure password isn't exposed
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .expect(401);

      console.log('Response:', response.body);
    });
  });

  describe('PATCH /api/v1/users/update', () => {
    it('should update user profile', async () => {
      const response = await request(app)
        .patch('/api/v1/users/update')
        .set('Cookie', authCookie)
        .send({ username: 'UpdatedUser' })
        .expect(200);

      console.log('Response:', response.body);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.username).toBe('UpdatedUser');
    });
  });
});
