import jwt from 'jsonwebtoken';
import TokenDenylist from '../models/TokenDenylist.model.js';
import User from '../models/user.model.js';
import passport from "passport";

export const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      // Extract access token from HTTP-only cookies
      const token = req.cookies.accessToken;


      if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("DEBUG: Decoded Token =>", decoded);
      } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Check if the token is revoked
      const isRevoked = await TokenDenylist.exists({ token });
      if (isRevoked) {
        return res.status(401).json({ error: 'Session expired' });
      }

      // Fetch user from database
      req.user = await User.findById(decoded.userId || decoded.id);
      // console.log("DEBUG: Authenticated User =>", req.user);
      
      if (!req.user) {
        return res.status(401).json({ error: 'User no longer exists' });
      }

      next();
    } catch (error) {
      // console.error("Auth Error:", error);/
      res.status(401).json({ error: 'Authentication failed' });
    }
  },

  restrictTo: (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  }
};


export const authenticateUser = async (req, res, next) => {
  try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify token and get user
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      req.user = user;  // Attach user to request
      next();
  } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
  }
};
