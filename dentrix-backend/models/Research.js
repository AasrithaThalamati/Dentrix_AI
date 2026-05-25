// models/Research.js
const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
  dentist:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  query:    { type: String, default: '' },   // what was searched/asked
  summary:  { type: String, default: '' },   // AI response or notes
  tags:     [{ type: String }],              // e.g. ['root canal', 'obturation']
  source:   { type: String, default: '' },   // URL or reference
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Research', researchSchema);