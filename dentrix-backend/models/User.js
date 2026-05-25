const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true, minlength: 6 },
  role:           { type: String, enum: ['dentist', 'admin', 'endodontist', 'student', 'researcher'], default: 'dentist' },
  clinic:         { type: String, default: '' },
  phone:          { type: String, default: '' },
  avatar:         { type: String, default: '' },
  firstName:      { type: String, default: '' },
  lastName:       { type: String, default: '' },
  specialization: { type: String, default: '' },
  dob:            { type: String, default: '' },
  gender:         { type: String, default: '' },
  city:           { type: String, default: '' },
  experience:     { type: Number, default: 0 },
  bio:            { type: String, default: '' },
  createdAt:      { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);