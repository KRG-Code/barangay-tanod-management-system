// authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginResident,
  loginTanod,
  getUserProfile,
  updateUserProfile,
  getAllUserProfiles,
  rateTanod,
  getTanodRatings,
  getUserRatings,
  deleteRating,
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


router.post('/login/resident', loginResident); // For residents

router.post('/login/tanod', loginTanod); // For Tanods

router.get('/users', protect, getAllUserProfiles); //Get all user profile

router.get('/me', protect, getUserProfile); // Get current user profile

router.put('/update', protect, updateUserProfile); // Update user profile

router.put('/change-password', protect, changePassword); // Change user password

router.post('/:tanodId/rate', protect, rateTanod); //Upload tanod rating

router.get('/:tanodId/ratings', protect, getTanodRatings);// Route to get ratings for a specific Tanod

router.get('/my-ratings', protect, getUserRatings);  // Get current user's ratings

router.delete('/ratings/:ratingId', protect, deleteRating);  // Delete a rating


module.exports = router;
