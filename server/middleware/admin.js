const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const chefAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Allow both admin and chef roles
    if (req.user.role !== 'admin' && req.user.role !== 'chef') {
      return res.status(403).json({ message: 'Chef or Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Chef auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminAuth, chefAuth };