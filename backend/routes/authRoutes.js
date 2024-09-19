const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getUserProfile, updateUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('firstName').notEmpty().withMessage('First Name is required'),
  body('lastName').notEmpty().withMessage('Last Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], registerUser);

router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
