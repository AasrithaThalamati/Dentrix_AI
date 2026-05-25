// models/Analysis.js
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  dentist:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  imageUrl:        { type: String, default: '' },
  obturationScore: { type: Number },
  aiReport:        { type: String, default: '' },   // ← was missing
  findings:        { type: String, default: '' },
  recommendation:  { type: String, default: '' },
  status: {                                          // ← was missing
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);