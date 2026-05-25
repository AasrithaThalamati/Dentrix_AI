require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const user = await User.findOne({ email: 'sushanth@gmail.com' });
  console.log('User found:', !!user);
  const match = await bcrypt.compare('Dentrix123', user.password);
  console.log('Password match:', match);
  process.exit();
});
