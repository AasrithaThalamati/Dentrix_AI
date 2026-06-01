const Analysis = require('../models/Analysis');
const path = require('path');
const fs = require('fs');

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

// POST /api/analysis/ai-score — Grok vision scoring (no DB save)
const aiScore = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

  const imageBuffer = req.file.buffer;
  const base64Image = imageBuffer.toString('base64');
  const mimeType    = req.file.mimetype;

  const prompt = `You are an expert endodontist AI analyzing an IOPA dental X-ray for root canal obturation quality.

Score the obturation on exactly these 3 parameters:

1. LENGTH ADEQUACY (0–4): fill reaching the apex
   4=within 0-2mm of apex, 3=2-4mm short, 2=>4mm short, 1=grossly short, 0=overextended

2. DENSITY UNIFORMITY (0–3): homogeneity, absence of voids
   3=no voids, 2=minor voids <1mm, 1=visible voids, 0=incomplete fill

3. TAPER CONTINUITY (0–3): smooth tapering geometry
   3=smooth continuous taper, 2=minor irregularities, 1=moderate irregularities, 0=broken taper

If no root canal fill is visible or it is not a dental X-ray, score all 0.

Respond ONLY with a raw JSON object (no markdown fences, no extra text):
{"length":<number>,"density":<number>,"taper":<number>,"confidence":<0-100>,"notes":"<one sentence>"}`;

  try {
    const grokRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.1,
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    if (!grokRes.ok) {
      const err = await grokRes.text();
      return res.status(502).json({ message: 'Groq API error', detail: err });
    }

    const grokData = await grokRes.json();
    const raw = grokData.choices?.[0]?.message?.content?.trim() || '{}';

    // Strip any accidental markdown fences
    const jsonStr = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
    const scores  = JSON.parse(jsonStr);

    const clamp = (v, min, max) => Math.min(Math.max(parseFloat((+v).toFixed(1)), min), max);

    const length   = clamp(scores.length,   0, 4);
    const density  = clamp(scores.density,  0, 3);
    const taper    = clamp(scores.taper,    0, 3);
    const total    = parseFloat((length + density + taper).toFixed(1));
    const confidence = clamp(scores.confidence, 0, 100);

    res.json({ length, density, taper, total, confidence, notes: scores.notes || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalyses, getAnalysis, createAnalysis, deleteAnalysis, aiScore };
