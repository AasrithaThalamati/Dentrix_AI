const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const {
      name, firstName, lastName, clinic, phone, email,
      specialization, dob, gender, city, experience,
      regNumber, researchFocus, bio, avatar
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (clinic !== undefined) updateFields.clinic = clinic;
    if (phone !== undefined) updateFields.phone = phone;
    if (email !== undefined) updateFields.email = email;
    if (specialization !== undefined) updateFields.specialization = specialization;
    if (dob !== undefined) updateFields.dob = dob;
    if (gender !== undefined) updateFields.gender = gender;
    if (city !== undefined) updateFields.city = city;
    if (experience !== undefined) updateFields.experience = experience;
    if (regNumber !== undefined) updateFields.regNumber = regNumber;
    if (researchFocus !== undefined) updateFields.researchFocus = researchFocus;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/profile/password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
