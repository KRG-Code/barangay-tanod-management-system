// authController.js
const User = require('../models/User');
const Equipment = require("../models/Equipment");
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

// Login an existing user
exports.loginResident = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user is a resident
      if (user.userType !== 'resident') {
        return res.status(401).json({ message: 'Unauthorized:You are not registered as a resident' });
      }

      // Login successful, send back user data and token
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        profilePicture: user.profilePicture
      });
    }
    // If email or password is incorrect
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
    console.log(user); // Add this line to see what user object is returned

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user is a tanod
      if (user.userType !== 'tanod') {
        return res.status(401).json({ message: 'Unauthorized: Not a Tanod' });
      }

      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
        profilePicture: user.profilePicture
      });
    }
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
