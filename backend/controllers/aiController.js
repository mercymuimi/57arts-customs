const axios = require('axios');
const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Shared helper — logs the real error so you can debug
const aiRequest = async (fn, fallback) => {
  try {
    return await fn();
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('[AI] Error:', detail);
    return fallback;
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { user_id, category, n = 6 } = req.query;
    const params = new URLSearchParams({ n });
    if (user_id)  params.append('user_id',  user_id);
    if (category) params.append('category', category);

    const { data } = await axios.get(`${AI_SERVICE}/recommendations?${params}`);
    res.json(data);
  } catch (err) {
    console.error('[AI] Recommendations error:', err.message);
    // ✅ Return empty recommendations gracefully — frontend won't crash
    res.status(200).json({
      strategy: 'fallback',
      recommendations: [],
      error: 'AI service unavailable'
    });
  }
};

exports.recordInteraction = async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE}/interactions`, req.body);
    res.json(data);
  } catch (err) {
    console.error('[AI] Interaction error:', err.message);
    // ✅ Don't fail loudly — interaction recording is non-critical
    res.status(200).json({ status: 'skipped', reason: 'AI service unavailable' });
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
    res.status(200).json({ similar: [] });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, user_id, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const { data } = await axios.post(`${AI_SERVICE}/chat`, {
      message,
      user_id: user_id || null,
      history: history || [],
    });
    res.json(data);
  } catch (err) {
    console.error('[AI] Chat error:', err.message);
    // ✅ Return a friendly fallback so chat widget doesn't break
    res.status(200).json({
      response: "Sorry, I'm having trouble right now. Please try again shortly."
    });
  }
};