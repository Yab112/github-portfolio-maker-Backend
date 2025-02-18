import User from '../models/user.model.js';
import { emailSender } from '../utils/emailSender.js';
import { generateOTP } from '../utils/otpGenerator.js';
import { generateHash,comparePassword } from "../utils/passwordUtils.js";
import { sendOTP } from './sendEmailService.js';

export const userService = {
  createUser: async (userData) => {
    if (await User.exists({ email: userData.email })) {
      throw new Error('Email already registered');
    }
    return User.create(userData);
  },

  getUserByEmail: (email) => User.findOne({ email }),
  
  getUserById: (id) => User.findById(id),
  
  getUserProfile: (userId) => User.findById(userId)
    .select('-password -refreshToken -otp -__v'),

  sendVerificationEmail: async (user) => {
    const otp = generateOTP();
    user.otp = await generateHash(otp);
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOTP(user.email, otp);
    return otp;
  },

  verifyEmail: async (otp, userId) => {
    if (!userId) {
      throw new Error("User ID not found in cookies");
    }

    const user = await User.findById(userId);
    if (!user || !(await comparePassword(otp, user.otp))) {
      throw new Error('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    
    return user.save();
  },


  updateUserProfile: (userId, updates) => User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshToken'),

  updateUserPassword: async (userId, { currentPassword, newPassword }) => {
    const user = await User.findById(userId).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();
  },

  deleteUserAccount: async (userId) => {
    await User.findByIdAndDelete(userId);
  },

  initiatePasswordReset: async (email) => {
    const user = await User.findOne({ email });
    if (!user) return;
    
    const otp = generateOTP();
    user.resetPasswordToken = await bcrypt.hash(otp, 12);
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await emailSender.sendPasswordResetEmail(email, otp);
  },

  completePasswordReset: async ({ email, otp, newPassword }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(otp, user.resetPasswordToken))) {
      throw new Error('Invalid or expired OTP');
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
};