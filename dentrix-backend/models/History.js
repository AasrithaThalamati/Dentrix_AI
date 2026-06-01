const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  dentist:        { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  patient:        { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  analysis:       { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
  caseId:         { type: String },           // e.g. "CA-0147"
  toothNumber:    { type: String },           // e.g. "26"
  visitType:      { type: String },           // e.g. "Post-obturation"
  obturationScore:{ type: Number },           // total 0–10
  lengthScore:    { type: Number },           // 0–4
  densityScore:   { type: Number },           // 0–3
  taperScore:     { type: Number },           // 0–3
  aiConfidence:   { type: Number },           // e.g. 92.1
  notes:          { type: String, default: '' },
  date:           { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
