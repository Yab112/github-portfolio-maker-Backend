import express from 'express';
import { userController } from '../controlleres/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/me', userController.getProfile);
router.patch('/update', userController.updateProfile);
router.patch('/update-password', userController.updatePassword);
router.delete('/delete', userController.deleteAccount);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/chat', userController.streamChatCompletion);
// router.get('/github/repos', userController.getUserRepos);

export default router;