const Patient = require('../models/Patient');
const Analysis = require('../models/Analysis');
const History = require('../models/History');

// GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const dentistId = req.user._id;

    const totalPatients = await Patient.countDocuments({ dentist: dentistId });
    const totalAnalyses = await Analysis.countDocuments({ dentist: dentistId });
    const historyRecords = await History.find({ dentist: dentistId }).sort({ date: -1 });

    const totalHistory = historyRecords.length;

    // Scores list from history + analyses
    const scores = historyRecords.map(h => h.obturationScore).filter(s => typeof s === 'number' && !isNaN(s));
    
    let avgScore = 0;
    if (scores.length) {
      avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    }

    // Retreatments / Suboptimal count (score < 6)
    const retreatmentsFlagged = scores.filter(s => s < 6.0).length;

    // Optimal count (score >= 8)
    const optimalCount = scores.filter(s => s >= 8.0).length;
    const pctOptimal = scores.length ? Math.round((optimalCount / scores.length) * 100) : 0;

    // Score distribution
    const distribution = {
      optimal: scores.filter(s => s >= 8.0).length,
      acceptable: scores.filter(s => s >= 6.0 && s < 8.0).length,
      suboptimal: scores.filter(s => s >= 4.0 && s < 6.0).length,
      poor: scores.filter(s => s < 4.0).length
    };

    // Parameter performance averages
    const lengths = historyRecords.map(h => h.lengthScore).filter(s => typeof s === 'number');
    const densities = historyRecords.map(h => h.densityScore).filter(s => typeof s === 'number');
    const tapers = historyRecords.map(h => h.taperScore).filter(s => typeof s === 'number');

    const avgLength = lengths.length ? (lengths.reduce((a,b)=>a+b, 0) / lengths.length).toFixed(1) : 0;
    const avgDensity = densities.length ? (densities.reduce((a,b)=>a+b, 0) / densities.length).toFixed(1) : 0;
    const avgTaper = tapers.length ? (tapers.reduce((a,b)=>a+b, 0) / tapers.length).toFixed(1) : 0;

    res.json({
      totalPatients,
      totalAnalyses: totalAnalyses || totalHistory,
      totalHistory,
      avgScore: parseFloat(avgScore),
      retreatmentsFlagged,
      pctOptimal,
      distribution,
      parameterPerformance: {
        avgLength: parseFloat(avgLength),
        avgDensity: parseFloat(avgDensity),
        avgTaper: parseFloat(avgTaper)
      },
      history: historyRecords.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };

