// routes/history.js
const express = require('express');
const router = express.Router();
const { getHistory, createHistory, updateHistory, deleteHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getHistory).post(createHistory);
router.route('/:id').put(updateHistory).delete(deleteHistory);

module.exports = router;
