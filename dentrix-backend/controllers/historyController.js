const History = require('../models/History');

// GET /api/history
const getHistory = async (req, res) => {
  try {
    const history = await History.find({ dentist: req.user._id })
      .populate('patient', 'name age')
      .populate('analysis', 'obturationScore imageUrl')
      .sort({ date: -1 });
    res.json(history);
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
