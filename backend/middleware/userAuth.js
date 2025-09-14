const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    req.user = user;
    next();
  } catch (err) {
    console.error('userProtect err', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { userProtect };
