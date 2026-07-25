const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeXrayWithGemini } = require('../services/geminiService');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// POST /api/analysis/ai-score — Gemini Vision X-ray Obturation Analysis
router.post('/ai-score', upload.single('xray'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No X-ray image file uploaded' });
    }

    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype || 'image/png';

    const result = await analyzeXrayWithGemini(imageBuffer, mimeType);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/analysis/ai-score:', error);
    res.status(500).json({
      message: error.message || 'Error processing X-ray image with Gemini API',
      detail: error.toString()
    });
  }
});

module.exports = router;