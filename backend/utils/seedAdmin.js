const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function seedAdminIfNeeded() {
  const email = process.env.ADMIN_EMAIL;
  const pwd = process.env.ADMIN_PASSWORD;
  if (!email || !pwd) {
    console.warn('ADMIN_EMAIL or ADMIN_PASSWORD not set in env — admin seed skipped.');
    return;
  }
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists.');
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pwd, salt);
  const admin = new Admin({ email: email.toLowerCase(), passwordHash: hash });
  await admin.save();
  console.log(`Admin seeded: ${email}`);
}

module.exports = { seedAdminIfNeeded };
