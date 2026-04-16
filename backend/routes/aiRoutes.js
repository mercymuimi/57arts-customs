const express = require('express');
const router = express.Router();
const { getRecommendations, recordInteraction, getSimilar } = require('../controllers/aiController');

// GET /api/ai/recommendations?user_id=u1&category=Fashion&n=6
router.get('/recommendations', getRecommendations);

// POST /api/ai/interactions  { user_id, product_id, action }
router.post('/interactions', recordInteraction);

// GET /api/ai/similar/:productId
router.get('/similar/:productId', getSimilar);

module.exports = router;