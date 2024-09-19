const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
connectDB();

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-url.com' : 'http://localhost:3000',
}));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'An unexpected error occurred', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGTERM', () => {
  server.close(() => console.log('Process terminated'));
});
