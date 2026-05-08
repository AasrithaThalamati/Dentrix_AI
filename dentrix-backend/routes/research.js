const express = require('express');
const router = express.Router();
const { getResearch, createResearch, deleteResearch } = require('../controllers/researchController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getResearch).post(createResearch);
router.route('/:id').delete(deleteResearch);

module.exports = router;
