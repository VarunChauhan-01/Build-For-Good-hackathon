/**
 * JWT Authentication Middleware (Mongoose version)
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');

/**
 * Strict auth — blocks request if no valid token.
 * Attaches full user object (with id, email, role, etc.) to req.user.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Fetch user from MongoDB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // Attach user to request
    const userObj = user.toObject();
    delete userObj.password_hash;
    
    // Normalize id as string for consistency
    userObj.id = String(userObj._id);

    req.user = userObj;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
}

/**
 * Optional auth — attaches user if a valid token is present, but lets
 * unauthenticated requests through. Controllers using this MUST guard
 * against req.user being undefined.
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (user) {
        const userObj = user.toObject();
        delete userObj.password_hash;
        userObj.id = String(userObj._id);
        req.user = userObj;
      }
    } catch {
      // Token invalid — continue without user
    }
  }
  next();
}

module.exports = { authMiddleware, optionalAuth };
