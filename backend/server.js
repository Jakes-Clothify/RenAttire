const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  ].filter(Boolean)
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app') || hostname.endsWith('.onrender.com');
  } catch (error) {
    return false;
  }
};

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (_req, res) => {
  res.send('RenAttire Backend API is running');
});
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clothes', require('./routes/clothRoutes'));
app.use('/api/rentals', require('./routes/rentalRoutes'));

app.listen(port, () => console.log(`Server running on port ${port}`));
