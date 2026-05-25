const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const {
      name, email, password, clinic, phone,
      role, specialization, dob, gender,
      city, experience, bio, firstName, lastName
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name:           name || `${firstName || ''} ${lastName || ''}`.trim(),
      firstName:      firstName || '',
      lastName:       lastName  || '',
      email,
      password,
      clinic:         clinic         || '',
      phone:          phone          || '',
      role:           role           || 'dentist',
      specialization: specialization || '',
      dob:            dob            || '',
      gender:         gender         || '',
      city:           city           || '',
      experience:     experience ? parseInt(experience) : 0,
      bio:            bio            || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id:             user._id,
        name:           user.name,
        firstName:      user.firstName,
        lastName:       user.lastName,
        email:          user.email,
        clinic:         user.clinic,
        phone:          user.phone,
        role:           user.role,
        specialization: user.specialization,
        dob:            user.dob,
        gender:         user.gender,
        city:           user.city,
        experience:     user.experience,
        bio:            user.bio,
        avatar:         user.avatar,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id:             user._id,
        name:           user.name,
        firstName:      user.firstName,
        lastName:       user.lastName,
        email:          user.email,
        clinic:         user.clinic,
        phone:          user.phone,
        role:           user.role,
        specialization: user.specialization,
        dob:            user.dob,
        gender:         user.gender,
        city:           user.city,
        experience:     user.experience,
        bio:            user.bio,
        avatar:         user.avatar,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, getMe };