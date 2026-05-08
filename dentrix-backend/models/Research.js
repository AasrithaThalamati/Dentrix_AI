const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  notes: { type: String, default: '' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Research', researchSchema);
