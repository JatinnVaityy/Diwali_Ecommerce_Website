require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const { seedAdminIfNeeded } = require('./utils/seedAdmin');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' })); // accept base64 images if needed
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');
  await seedAdminIfNeeded();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);          // user register/login
app.use('/api/admin', adminRoutes);        // admin login
app.use('/api/products', productRoutes);   // products (public + admin)
app.use('/api/orders', orderRoutes);       // orders (user + admin)

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Serve frontend in production (if you build & place in ../frontend/dist)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
