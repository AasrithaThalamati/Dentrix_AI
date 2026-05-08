const Research = require('../models/Research');

// GET /api/research
const getResearch = async (req, res) => {
  try {
    const research = await Research.find({ dentist: req.user._id }).sort({ createdAt: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/research
const createResearch = async (req, res) => {
  try {
    const entry = await Research.create({ ...req.body, dentist: req.user._id });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/research/:id
const deleteResearch = async (req, res) => {
  try {
    await Research.findOneAndDelete({ _id: req.params.id, dentist: req.user._id });
    res.json({ message: 'Research entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getResearch, createResearch, deleteResearch };
