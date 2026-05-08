const Analysis = require('../models/Analysis');
const path = require('path');

// GET /api/analysis
const getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ dentist: req.user._id })
      .populate('patient', 'name age')
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analysis/:id
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, dentist: req.user._id })
      .populate('patient', 'name age gender');
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/analysis — Upload X-ray and run AI analysis
const createAnalysis = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const imageUrl = `/uploads/${req.file.filename}`;

    // --- AI Scoring Logic (placeholder) ---
    // Replace this with your actual AI model call
    // e.g., call OpenAI Vision API, a Python microservice, etc.
    const obturationScore = Math.floor(Math.random() * 40) + 60; // mock score 60-100
    const aiReport = `Radiographic analysis complete. Obturation score: ${obturationScore}/100. 
    Apical seal appears ${obturationScore > 80 ? 'adequate' : 'suboptimal'}. 
    Recommend follow-up in ${obturationScore > 80 ? '6' : '3'} months.`;
    // --- End AI Logic ---

    const analysis = await Analysis.create({
      dentist: req.user._id,
      patient: patientId,
      imageUrl,
      obturationScore,
      aiReport,
      status: 'completed'
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/analysis/:id
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, dentist: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json({ message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalyses, getAnalysis, createAnalysis, deleteAnalysis };
