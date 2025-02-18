import jwt from 'jsonwebtoken';
import TokenDenylist from '../models/TokenDenylist.model.js';
import User from '../models/user.model.js';

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
