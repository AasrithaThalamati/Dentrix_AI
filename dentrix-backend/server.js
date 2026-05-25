const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const authRoutes = require('./routes/authRoutes');

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500', 'https://dentrixxai.netlify.app'],
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Request Logger ─────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ── Health Check ───────────────────────────────────────────
app.get('/', (req, res) => res.json({
  message: 'Dentrix AI Backend is running!',
  status: 'ok',
  timestamp: new Date().toISOString()
}));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/patients',  require('./routes/patients'));
app.use('/api/analysis',  require('./routes/analysis'));
app.use('/api/history',   require('./routes/history'));
app.use('/api/profile',   require('./routes/profile'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/research',  require('./routes/research'));

// ── Smile Design AI Proxy (Gemini Vision) ──────────────────
// Receives { base64, mimeType } from the frontend,
// calls Gemini 2.0 Flash and returns structured JSON result.
app.post('/api/smile-design', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not set in .env' });
    }

    const { base64, mimeType } = req.body;
    if (!base64 || !mimeType) {
      return res.status(400).json({ error: 'Missing base64 or mimeType in request body' });
    }

    const prompt = `You are an expert aesthetic dentist specialising in smile design and the face-tooth shape correspondence principle (Williams 1914, Frush & Fisher 1958).

Analyse the uploaded facial photograph and return ONLY a valid JSON object. No markdown, no explanation outside the JSON.

Return exactly this structure:
{
  "faceShape": "oval|round|square|heart|diamond|oblong|triangular",
  "faceShapeDescription": "2-3 sentence description of the detected facial geometry",
  "primaryRecommendation": {
    "toothShape": "oval|round|square|triangular|tapered",
    "compatibilityScore": 92,
    "reasoning": "3-4 sentences explaining why this shape suits this face"
  },
  "allShapeScores": {
    "oval": 92,
    "round": 75,
    "square": 60,
    "triangular": 45,
    "tapered": 70
  },
  "clinicalNotes": "2-3 sentences of clinical aesthetic notes covering smile arc, golden proportion, midline",
  "suggestions": [
    "Actionable suggestion 1 for the dentist",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ]
}

If no clear frontal face is visible, return:
{ "error": "no_face", "message": "No clear frontal face detected. Please upload a well-lit frontal face photo." }`;

    const geminiBody = {
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64 } }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024
      }
    };

    // ✅ Fixed: gemini-2.0-flash (gemini-1.5-flash removed from v1beta)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', JSON.stringify(data));
      return res.status(response.status).json({
        error: data.error?.message || 'Gemini API error'
      });
    }

    // Extract text from Gemini response
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch (parseErr) {
      console.error('JSON parse error. Raw Gemini output:', rawText);
      res.status(500).json({ error: 'Failed to parse Gemini response as JSON' });
    }

  } catch (err) {
    console.error('Smile Design proxy error:', err.message);
    res.status(500).json({ error: 'Failed to reach Gemini API: ' + err.message });
  }
});
// ───────────────────────────────────────────────────────────

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ── Connect MongoDB → Start Server ─────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5001}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });