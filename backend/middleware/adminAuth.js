const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminProtect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    req.admin = admin;
    next();
  } catch (err) {
    console.error('adminProtect err', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { adminProtect };
