const express = require('express');
const router  = express.Router();
const {
  getRecommendations,
  recordInteraction,
  getSimilar,
  chat,
  getChatHistory,
  generateImage,
} = require('../controllers/aiController');

// GET  /api/ai/recommendations?user_id=u1&category=Fashion&n=6
router.get('/recommendations', getRecommendations);

// POST /api/ai/interactions  { user_id, product_id, action }
router.post('/interactions', recordInteraction);

// GET  /api/ai/similar/:productId
router.get('/similar/:productId', getSimilar);

// POST /api/ai/chat  { message, user_id, history, session_id }
router.post('/chat', chat);

// GET  /api/ai/chat-history?session_id=xxx  (optional: admin/debug)
router.get('/chat-history', getChatHistory);

// POST /api/ai/generate-image  { prompt, category } — Stability AI
router.post('/generate-image', generateImage);

module.exports = router;