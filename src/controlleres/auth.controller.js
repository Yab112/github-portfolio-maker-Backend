import { authService } from '../services/auth.service.js';
import { userService } from '../services/user.service.js';

export const authController = {
  register: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      await userService.sendVerificationEmail(user);
      res.status(201).json({ message: 'OTP sent to email', userId: user._id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const user = await userService.verifyEmail(req.params.userId, req.body.otp);
      const { accessToken, refreshToken } = authService.generateTokens(user);
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      authService.setAuthCookies(res, accessToken, refreshToken);
      res.json({ message: 'Email verified and user logged in' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const user = await authService.authenticateUser(req.body);
      const otp = await userService.sendVerificationEmail(user);
      res.json({ message: 'OTP sent to email', userId: user._id });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { newAccessToken } = await authService.refreshAccessToken(req.cookies.refreshToken);
      authService.setAccessTokenCookie(res, newAccessToken);
      res.json({ message: 'Token refreshed' });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      await authService.revokeTokens(req.user, req.cookies.accessToken);
      authService.clearAuthCookies(res);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  resendOTP: async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.userId);
      if (!user) throw new Error('User not found');
      const otp = await userService.sendVerificationEmail(user);
      res.json({ message: 'OTP resent to email' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};