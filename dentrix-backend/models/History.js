const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
  treatment: { type: String, required: true },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
