const axios = require('axios');
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.getRecommendations = async (req, res) => {
  try {
    const { user_id, category, n = 6 } = req.query;
    const params = new URLSearchParams({ n });
    if (user_id) params.append('user_id', user_id);
    if (category) params.append('category', category);

    // ✅ FIXED: removed /api prefix
    const { data } = await axios.get(`${AI_SERVICE}/recommendations?${params}`);
    res.json(data);
  } catch (err) {
    console.error('[AI] Recommendations error:', err.message);
    res.status(502).json({ error: 'AI service unavailable', recommendations: [] });
  }
};

exports.recordInteraction = async (req, res) => {
  try {
    // ✅ FIXED: removed /api prefix
    const { data } = await axios.post(`${AI_SERVICE}/interactions`, req.body);
    res.json(data);
  } catch (err) {
    console.error('[AI] Interaction error:', err.message);
    res.status(502).json({ error: 'Could not record interaction' });
  }
};

exports.getSimilar = async (req, res) => {
  try {
    const { productId } = req.params;
    const { n = 4 } = req.query;
    const { data } = await axios.get(`${AI_SERVICE}/similar/${productId}?n=${n}`);
    res.json(data);
  } catch (err) {
    console.error('[AI] Similar products error:', err.message);
    res.status(502).json({ error: 'Could not fetch similar products' });
  }
};