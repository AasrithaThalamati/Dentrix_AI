const express = require('express');
const router = express.Router();
const { getAnalyses, getAnalysis, createAnalysis, deleteAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/').get(getAnalyses).post(upload.single('xray'), createAnalysis);
router.route('/:id').get(getAnalysis).delete(deleteAnalysis);

module.exports = router;
