import { authService } from "../services/auth.service.js";
import { userService } from "../services/user.service.js";
import passport from "passport";

export const authController = {
  register: async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      await userService.sendVerificationEmail(user);
      res.cookie("userId", user._id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      if (!req.cookies || !req.cookies.userId) {
        return res.status(400).json({ error: "User ID not found in cookies" });
      }

      if (!req.body || !req.body.otp) {
        return res.status(400).json({ error: "OTP is missing" });
      }

      // Verify the OTP and get the user
      const user = await userService.verifyEmail(
        req.body.otp,
        req.cookies.userId
      );

      // Generate access and refresh tokens
      const { accessToken, refreshToken } = authService.generateTokens(user);

      // Set refresh token and expiration time in the user record
      const refreshTokenExpires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
      user.refreshToken = refreshToken; 
      user.refreshTokenExpires = refreshTokenExpires;
      await user.save();

      // Set the cookies for access and refresh tokens
      authService.setAuthCookies(res, accessToken, refreshToken);

      res.json({ message: "Email verified and user logged in" });
    } catch (error) {
      console.error("DEBUG: Error in verifyEmail", error);
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      // Authenticate the user by email and password
      const user = await authService.authenticateUser(req.body);

      // Generate and set the access and refresh tokens for the user
      const { accessToken, refreshToken } = authService.generateTokens(user);

      // Store the tokens in cookies
      authService.setAuthCookies(res, accessToken, refreshToken);

      res.json({ message: "User Logged in Successfully" });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      // Check if refreshToken exists in cookies
      if (!req.cookies.refreshToken) {
        return res.status(400).json({ error: "No refresh token provided" });
      }

      const { newAccessToken } = await authService.refreshAccessToken(
        req.cookies.refreshToken
      );
      authService.setAuthToeknForrefresh(res, newAccessToken);
      res.json({ message: "Token refreshed" });
    } catch (error) {
      console.log("DEBUG:check the error in the refresh token", error);
      res.status(401).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      console.log(req.user);
      console.log(req.cookies.accessToken);
      await authService.revokeTokens(req.user, req.cookies.accessToken);
      authService.clearAuthCookies(res);
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resendOTP: async (req, res) => {
    try {
      if (!req.cookies || !req.cookies.userId) {
        return res.status(400).json({ error: "User ID not found in cookies" });
      }

      const user = await userService.getUserById(req.cookies.userId);
      if (!user) throw new Error("User not found");

      // Resend OTP to email
      const otp = await userService.sendVerificationEmail(user);
      res.json({ message: "OTP resent to email" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  githubAuth: (req, res, next) => {
    passport.authenticate("github")(req, res, next);
  },

  githubCallback: async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const { accessToken, refreshToken } = authService.generateTokens(req.user);

    req.user.refreshToken = refreshToken;
    req.user.refreshTokenExpires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    await req.user.save();

    authService.setAuthCookies(res, accessToken, refreshToken);

    res.redirect(
      "http://localhost:5173/dashboard"
    );
  },
};
