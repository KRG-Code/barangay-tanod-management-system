// authController.js
const User = require('../models/User');
const Equipment = require("../models/Equipment");
const TanodRating=require('../models/Rating');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { bucket } = require('../config/firebaseAdmin');

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register a new user
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { firstName, lastName, username, email, password, userType, ...rest } = req.body;

  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ firstName, lastName, username, email, password, userType, ...rest });
    res.status(201).json({ _id: user._id, firstName: user.firstName, lastName: user.lastName, username: user.username, email: user.email, token: generateToken(user._id) });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all user profiles
exports.getAllUserProfiles = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    if (!users.length) return res.status(404).json({ message: 'No users found' });
    
    // Return the user data
    res.json(users);
  } catch (error) {
    console.error('Error fetching all user profiles:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, req.body);
    if (req.file) user.profilePicture = req.file.filename;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginResident = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Verify password and user type
    if (user && (await bcrypt.compare(password, user.password)) && user.userType === 'resident') {
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id),  // Use the generateToken function
        profilePicture: user.profilePicture,
      });
    }

    // Invalid credentials
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginTanod = async (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body
  try {
    const user = await User.findOne({ username }); // Find user by username

    // Verify password and user type
    if (user && (await bcrypt.compare(password, user.password)) && user.userType === 'tanod') {
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id),  // Use the generateToken function
        profilePicture: user.profilePicture,
      });
    }

    // Invalid credentials
    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Change Password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10); // Hash new password
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to add equipment
exports.addEquipment = async (req, res) => {
  const { name, borrowDate, returnDate, imageUrl } = req.body;

  try {
    const newEquipment = new Equipment({
      name,
      borrowDate,
      returnDate,
      imageUrl,
      user: req.user.id, // Assuming user is authenticated
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error("Error saving equipment:", error);
    res.status(500).json({ message: 'Error saving equipment' });
  }
};

// Function to get all equipment
exports.getEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find({ user: req.user._id }).populate('user', 'firstName lastName');
    res.status(200).json(equipments);
  } catch (error) {
    console.error("Error fetching equipments:", error);
    res.status(500).json({ message: 'Error fetching equipments' });
  }
};

// Update equipment by ID
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    equipment.returnDate = req.body.returnDate; // Update return date
    const updatedEquipment = await equipment.save();
    
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rateTanod = async (req, res) => {
  const { tanodId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating or comment' });
  }

  try {
    // Check if the user has already rated the Tanod
    let existingRating = await TanodRating.findOne({ tanodId, userId: req.user._id });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated successfully' });
    } else {
      // Create a new rating if none exists
      const newRating = new TanodRating({
        tanodId,
        userId: req.user._id,
        rating,
        comment,
      });

      await newRating.save();
      return res.status(201).json({ message: 'Rating submitted successfully' });
    }
  } catch (error) {
    console.error('Error saving rating:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};

// Get ratings by the logged-in user
exports.getUserRatings = async (req, res) => {
  try {
    const ratings = await TanodRating.find({ userId: req.user._id }).populate('tanodId', 'firstName lastName');
    
    if (!ratings.length) {
      return res.status(404).json({ message: 'No ratings found' });
    }
    
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete rating by the logged-in user
exports.deleteRating = async (req, res) => {
  try {
    const rating = await TanodRating.findOneAndDelete({ _id: req.params.ratingId, userId: req.user._id });
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to delete this rating' });
    }
    
    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Tanod ratings
exports.getTanodRatings = async (req, res) => {
  const { tanodId } = req.params;

  try {
    const ratings = await TanodRating.find({ tanodId })
      .populate('userId', 'firstName lastName') // Populate userId with firstName and lastName
      .select('rating comment createdAt userId'); // Select fields

    if (!ratings.length) {
      return res.status(404).json({ message: 'No ratings found for this Tanod.' });
    }

    const overallRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5

    ratings.forEach(r => {
      ratingCounts[r.rating - 1]++;
    });

    // Map the ratings to include userId and comment
    const commentsWithUser = ratings.map(r => ({
      userId: r.userId._id, // Include the user's ID
      fullName: `${r.userId.firstName} ${r.userId.lastName}`, // Construct full name
      comment: r.comment, // Comment
    }));

    res.json({
      overallRating: overallRating.toFixed(1), // Round to one decimal
      ratingCounts,
      comments: commentsWithUser, // Return the structured comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};
