const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-url.com' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Import authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'An unexpected error occurred',
    error: err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
