const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const { getAnalyses, getAnalysis, createAnalysis, deleteAnalysis, aiScore } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Memory-only multer for AI scoring (no disk write needed)
const memUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.use(protect);

router.post('/ai-score', memUpload.single('xray'), aiScore);
router.route('/').get(getAnalyses).post(upload.single('xray'), createAnalysis);
router.route('/:id').get(getAnalysis).delete(deleteAnalysis);

module.exports = router;
