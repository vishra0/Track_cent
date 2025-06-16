import { verifyToken } from '../lib/auth';
import User from '../models/User';
import dbConnect from '../lib/mongodb';

export const authenticate = (req, res, next) => {
  return async () => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Access token required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      await dbConnect();
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
};