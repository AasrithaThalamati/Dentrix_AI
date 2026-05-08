const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  dentist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  imageUrl: { type: String, required: true },  // X-ray image URL
  obturationScore: { type: Number, min: 0, max: 100 },
  findings: { type: String, default: '' },
  aiReport: { type: String, default: '' },      // AI-generated report
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
