import express from 'express';
import { authController } from '../controlleres/auth.controller.js';
import { rateLimiter } from '../middleware/rate-limiter.middleware.js';

const router = express.Router();

router.post('/register', rateLimiter, authController.register);
router.post('/verify-email/:userId', authController.verifyEmail);
router.post('/login', rateLimiter, authController.login);
router.post('/refresh-token',rateLimiter, authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/resend-otp/:userId', authController.resendOTP);

export default router;