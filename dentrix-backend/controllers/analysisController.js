const Analysis = require('../models/Analysis');
const path = require('path');
const fs = require('fs');
const { analyzeXrayWithGemini } = require('../services/geminiService');

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

// POST /api/analysis — Upload X-ray and run AI analysis (with DB save)
const createAnalysis = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

    const imageUrl = `/uploads/${req.file.filename}`;
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    const imageBuffer = fs.readFileSync(imagePath);

    // Call Gemini Vision API service
    const scoreResult = await analyzeXrayWithGemini(imageBuffer, req.file.mimetype);

    const obturationScore = scoreResult.total;
    const aiReport = `Radiographic analysis complete via Gemini AI. Obturation score: ${obturationScore}/10. 
Length: ${scoreResult.length}/4, Density: ${scoreResult.density}/3, Taper: ${scoreResult.taper}/3. 
Notes: ${scoreResult.notes}`;

    const analysis = await Analysis.create({
      dentist: req.user._id,
      patient: patientId,
      imageUrl,
      obturationScore,
      aiReport,
      status: 'completed'
    });

    res.status(201).json({ ...analysis.toObject(), scoreDetails: scoreResult });
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

// POST /api/analysis/ai-score — Gemini vision scoring (no DB save)
const aiScore = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  try {
    const imageBuffer = req.file.buffer || fs.readFileSync(req.file.path);
    const mimeType = req.file.mimetype || 'image/png';

    const result = await analyzeXrayWithGemini(imageBuffer, mimeType);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalyses, getAnalysis, createAnalysis, deleteAnalysis, aiScore };
