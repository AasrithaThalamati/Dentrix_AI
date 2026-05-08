const Patient = require('../models/Patient');
const Analysis = require('../models/Analysis');
const History = require('../models/History');

// GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const dentistId = req.user._id;

    const totalPatients = await Patient.countDocuments({ dentist: dentistId });
    const totalAnalyses = await Analysis.countDocuments({ dentist: dentistId });
    const totalHistory = await History.countDocuments({ dentist: dentistId });

    // Average obturation score
    const scoreData = await Analysis.aggregate([
      { $match: { dentist: dentistId, status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$obturationScore' } } }
    ]);
    const avgScore = scoreData.length ? scoreData[0].avgScore.toFixed(1) : 0;

    // Monthly analysis count (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyData = await Analysis.aggregate([
      { $match: { dentist: dentistId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);

    res.json({ totalPatients, totalAnalyses, totalHistory, avgScore, monthlyData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
