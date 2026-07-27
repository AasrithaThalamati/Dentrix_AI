const History = require('../models/History');
const Patient = require('../models/Patient');

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
      const patientName = r.patient?.name || r.patientName || 'Unknown';
      const caseId = r.caseId || `CA-${String(r._id).slice(-4).toUpperCase()}`;
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
    let patientId = req.body.patient;
    let patientName = req.body.patientName || req.body.patient;

    // If patientName is provided but not ObjectId, find or create Patient doc
    if (typeof patientName === 'string' && patientName.trim() && !patientId) {
      let patientDoc = await Patient.findOne({ dentist: req.user._id, name: patientName.trim() });
      if (!patientDoc) {
        patientDoc = await Patient.create({ name: patientName.trim(), dentist: req.user._id });
      }
      patientId = patientDoc._id;
    }

    const entry = await History.create({
      ...req.body,
      patient: patientId,
      patientName: typeof patientName === 'string' ? patientName.trim() : '',
      dentist: req.user._id
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/history/:id
const updateHistory = async (req, res) => {
  try {
    const updated = await History.findOneAndUpdate(
      { _id: req.params.id, dentist: req.user._id },
      { $set: req.body },
      { new: true }
    ).populate('patient', 'name age _id');

    if (!updated) return res.status(404).json({ message: 'Record not found' });

    const patientName = updated.patient?.name || 'Unknown';
    const caseId = updated.caseId || `CA-${String(updated._id).slice(-4).toUpperCase()}`;
    const pid = updated.patient?._id ? `PT-${String(updated.patient._id).slice(-4).toUpperCase()}` : 'PT-????';

    res.json({
      id:         caseId,
      _id:        updated._id,
      patient:    patientName,
      initials:   getInitials(patientName),
      pid,
      tooth:      updated.toothNumber  || '—',
      date:       updated.date,
      score:      updated.obturationScore ?? null,
      length:     updated.lengthScore   ?? null,
      density:    updated.densityScore  ?? null,
      taper:      updated.taperScore    ?? null,
      visit:      updated.visitType     || '—',
      confidence: updated.aiConfidence  ?? null,
      notes:      updated.notes         || '',
    });
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

module.exports = { getHistory, createHistory, updateHistory, deleteHistory };

