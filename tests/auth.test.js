import request from 'supertest';
import app from '../src/app';
import User from '../src/models/user.model';
import { setupDB, teardownDB, clearDB } from './helpers';

describe('Auth System', () => {
  beforeAll(async () => await setupDB());
  afterAll(async () => await teardownDB());
  afterEach(async () => await clearDB());

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user and hash the password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(201);

      console.log('Response:', response.body);

      expect(response.body.message).toBe('OTP sent to email');
      expect(response.body.userId).toBeDefined();

      const user = await User.findById(response.body.userId);
      expect(user).toBeDefined();
      expect(user.isVerified).toBe(false);
      expect(user.password).not.toBe('Password123!'); // Ensure password is hashed
    });

    it('should fail with an existing email', async () => {
      await User.create({
        username: 'existinguser',
        email: 'exists@example.com',
        password: 'Password123!'
      });

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'exists@example.com',
          password: 'Password123!'
        })
        .expect(400);

      console.log('Response:', response.body);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'Password123!',
        isVerified: true
      });
    });

    it('should log in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        })
        .expect(200);

      console.log('Response:', response.body);

      expect(response.body.message).toBe('OTP sent to email');
      expect(response.body.userId).toBeDefined();
    });

    it('should fail with an invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword'
        })
        .expect(401);

      console.log('Response:', response.body);

      expect(response.body.error).toBeDefined();
    });
  });
});
