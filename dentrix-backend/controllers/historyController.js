const History = require('../models/History');

function getInitials(name) {
  if (!name) return '??';
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

// GET /api/history
const getHistory = async (req, res) => {
  try {
    const records = await History.find({ dentist: req.user._id })
      .populate('patient', 'name age _id')
      .sort({ date: -1 });

    const cases = records.map(r => {
      const patientName = r.patient?.name || 'Unknown';
      // Build a short display ID from the Mongo _id if no caseId stored
      const caseId = r.caseId || `CA-${String(r._id).slice(-4).toUpperCase()}`;
      // Build a short patient ID
      const pid = r.patient?._id
        ? `PT-${String(r.patient._id).slice(-4).toUpperCase()}`
        : 'PT-????';

      return {
        id:         caseId,
        _id:        r._id,
        patient:    patientName,
        initials:   getInitials(patientName),
        pid,
        tooth:      r.toothNumber  || '—',
        date:       r.date,
        score:      r.obturationScore ?? null,
        length:     r.lengthScore   ?? null,
        density:    r.densityScore  ?? null,
        taper:      r.taperScore    ?? null,
        visit:      r.visitType     || '—',
        confidence: r.aiConfidence  ?? null,
        notes:      r.notes         || '',
      };
    });

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/history
const createHistory = async (req, res) => {
  try {
    const entry = await History.create({ ...req.body, dentist: req.user._id });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/history/:id
const deleteHistory = async (req, res) => {
  try {
    await History.findOneAndDelete({ _id: req.params.id, dentist: req.user._id });
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory, createHistory, deleteHistory };
