// authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginResident,
  loginTanod,
  getUserProfile,
  updateUserProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User registration route
router.post('/register', [
  body('firstName').notEmpty().withMessage('First Name is required'),
  body('lastName').notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], registerUser);

// User login route
// authRoutes.js
// User login routes
router.post('/login/resident', loginResident); // For residents

router.post('/login/tanod', loginTanod);       // For Tanods


// Get current user profile
router.get('/me', protect, getUserProfile);

// Update user profile
router.put('/update', protect, updateUserProfile);

// Change user password
router.put('/change-password', protect, changePassword);

module.exports = router;
