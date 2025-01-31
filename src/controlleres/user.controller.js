import { userService } from '../services/user.service.js';

export const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updatePassword: async (req, res) => {
    try {
      await userService.updateUserPassword(req.user.id, req.body);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      await userService.deleteUserAccount(req.user.id);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      await userService.initiatePasswordReset(req.body.email);
      res.json({ message: 'Password reset instructions sent to email' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      await userService.completePasswordReset(req.body);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};