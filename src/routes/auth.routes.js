import express from 'express';
import { authController } from '../controlleres/auth.controller.js';
import { rateLimiter } from '../middleware/rate-limiter.middleware.js';

const router = express.Router();

router.post('/register', rateLimiter, authController.register);
router.post('/verify', authController.verifyEmail);
router.post('/login', rateLimiter, authController.login);
router.post('/refresh-token',rateLimiter, authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/resend-otp', authController.resendOTP);

export default router;