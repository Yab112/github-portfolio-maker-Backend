import jwt from 'jsonwebtoken';
import  TokenDenylist  from '../models/TokenDenylist.model.js';
import { userService } from '../services/user.service.js';

export const authService = {
  generateTokens: (user) => {
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  },

  authenticateUser: async ({ email, password }) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    if (!user.isVerified) throw new Error('Email not verified');
    return user;
  },

  setAuthCookies: (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },

  refreshAccessToken: async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await userService.getUserById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    return { 
      newAccessToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' })
    };
  },

  revokeTokens: async (user, accessToken) => {
    await TokenDenylist.create({ 
      token: accessToken,
      expires: new Date(Date.now() + 15 * 60 * 1000)
    });
    user.refreshToken = undefined;
    await user.save();
  },

  clearAuthCookies: (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
};