const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  address: { type: String, required: false }, // Add this line
  contactNumber: { type: String, required: false },
  birthday: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});



// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
