import jwt from 'jsonwebtoken';
import  TokenDenylist  from '../models/TokenDenylist.model.js';

export const authMiddleware = {
  protect: async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      console.log(token,"***********")
      if (!token) throw new Error('Not authenticated');

      const isRevoked = await TokenDenylist.exists({ token });
      if (isRevoked) throw new Error('Session expired');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  restrictTo: (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  }
};