const axios    = require('axios');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const ChatHistory = require('../models/ChatHistory');
const Product     = require('../models/Product');

const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const buildDbMap = (dbProducts) => {
  const map = {};
  dbProducts.forEach(p => {
    if (p._id)  map[String(p._id)] = p;
    if (p.slug) map[p.slug]        = p;
  });
  return map;
};

const resolveImg = (r, dbRecord) =>
  [r.img, r.image, r.imageUrl, r.thumbnail, dbRecord?.images?.[0]]
    .find(v => v && typeof v === 'string' && v.startsWith('http')) || null;

const normaliseRec = (r, dbMap) => {
  const bySlug = r.slug ? dbMap[r.slug] : null;
  const byId   = (r._id || r.id) ? dbMap[String(r._id || r.id)] : null;
  const db     = bySlug || byId || null;
  return {
    _id:      r._id      || db?._id,
    id:       r.id       || r.slug  || String(r._id || ''),
    name:     r.name     || db?.name,
    category: r.category || db?.category,
    price:    r.price    || db?.price,
    slug:     r.slug     || db?.slug,
    tag:      r.tag      || db?.tag || null,
    reason:   r.reason   || null,
    img:      resolveImg(r, db),
  };
};

// Decode arraybuffer error body from Stability AI into a readable string
const decodeStabilityError = (err) => {
  if (!err.response?.data) return err.message || 'Unknown error';
  try {
    const decoded = Buffer.from(err.response.data).toString('utf8');
    console.error('[AI] Stability AI raw error body:', decoded);
    const parsed = JSON.parse(decoded);
    return parsed?.errors?.[0] || parsed?.message || parsed?.name || decoded;
  } catch {
    return err.response?.statusText || err.message || 'Image generation failed';
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATIONS
// ══════════════════════════════════════════════════════════════════════════════

exports.getRecommendations = async (req, res) => {
  try {
    const { user_id, category, n = 6 } = req.query;
    const params = new URLSearchParams({ n });
    if (user_id)  params.append('user_id',  user_id);
    if (category) params.append('category', category);

    const { data } = await axios.get(`${AI_SERVICE}/recommendations?${params}`);
    const recs = data?.recommendations || [];

    if (recs.length) {
      const slugs = recs.map(r => r.slug).filter(Boolean);
      const ids   = recs.map(r => r._id || r.id).filter(Boolean);
      const orClauses = [];
      if (slugs.length) orClauses.push({ slug: { $in: slugs } });
      if (ids.length)   orClauses.push({ _id:  { $in: ids   } });

      const dbProducts = orClauses.length
        ? await Product.find({ $or: orClauses }).select('slug images tag').lean()
        : [];

      const dbMap = buildDbMap(dbProducts);
      data.recommendations = recs.map(r => normaliseRec(r, dbMap));
    }

    res.json(data);
  } catch {
    // Fallback: serve products directly from DB
    try {
      const filter = { inStock: true };
      if (req.query.category) filter.category = { $regex: req.query.category, $options: 'i' };
      const products = await Product.find(filter).limit(Number(req.query.n) || 6).lean();
      const recs = products.map(p => ({
        _id:      p._id,
        id:       p.slug,
        name:     p.name,
        category: p.category,
        price:    p.price,
        slug:     p.slug,
        tag:      p.tag  || null,
        reason:   'Top pick in ' + p.category,
        img:      p.images?.[0] || null,
      }));
      res.json({ strategy: 'db_fallback', recommendations: recs });
    } catch {
      res.status(200).json({ strategy: 'fallback', recommendations: [] });
    }
  }
};

exports.recordInteraction = async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE}/interactions`, req.body);
    res.json(data);
  } catch {
    res.status(200).json({ status: 'skipped' });
  }
};

exports.getSimilar = async (req, res) => {
  try {
    const { data } = await axios.get(`${AI_SERVICE}/similar/${req.params.productId}?n=${req.query.n || 4}`);
    res.json(data);
  } catch {
    res.status(200).json({ similar: [] });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// CHAT — Intent detection + response bank
// ══════════════════════════════════════════════════════════════════════════════

const fetchProducts = async (category = null, limit = 3) => {
  try {
    const filter = { inStock: true };
    if (category) filter.category = { $regex: category, $options: 'i' };
    const products = await Product.find(filter).limit(limit).lean();
    return products.map(p => ({
      _id:      p._id,
      id:       p.slug,
      name:     p.name,
      category: p.category,
      price:    p.price,
      slug:     p.slug,
      tag:      p.tag  || null,
      img:      p.images?.[0] || null,
    }));
  } catch {
    return [];
  }
};

const detectIntent = (msg) => {
  const m = msg.toLowerCase();
  if (/^(hi+|hello+|hey+|hiya|good\s*(morning|afternoon|evening|day)|howdy|greetings|yo+|sup|what'?s up)/i.test(m))                  return 'greeting';
  if (/\b(bye|goodbye|see you|take care|later|ciao|farewell|good night)\b/i.test(m))                                                  return 'farewell';
  if (/\b(thank|thanks|thx|appreciate|cheers|great help|helpful)\b/i.test(m))                                                         return 'thanks';
  if (/\b(who are you|what are you|are you.*(bot|ai|human|robot)|your name|introduce yourself)\b/i.test(m))                           return 'identity';
  if (/\b(about|57 arts|57arts|platform|marketplace|tell me about|what is this site|what do you sell)\b/i.test(m))                    return 'about';
  if (/\b(fashion|cloth|wear|outfit|dress|shirt|jacket|blazer|denim|hoodie|sandal|skirt|trouser|suit|apparel|attire)\b/i.test(m))     return 'fashion';
  if (/\b(furniture|chair|table|stool|sofa|bed|shelf|bookcase|desk|cabinet|wood|teak|walnut|oak|bench)\b/i.test(m))                   return 'furniture';
  if (/\b(bead|jewel|jeweller|necklace|bracelet|ring|cowrie|obsidian|kente|accessory|accessories|pendant)\b/i.test(m))                return 'beads';
  if (/\b(trend|trending|popular|best.?seller|top|featured|hot|new arrival|latest|fresh|most liked)\b/i.test(m))                      return 'trending';
  if (/\b(show|see|find|browse|look|search|explore|want|need|looking for|recommend|suggest|pick|what.*have|any.*product|available|products)\b/i.test(m)) return 'browse';
  if (/\b(custom|bespoke|commission|made.to.order|personaliz|personalise|unique|design|my own|hand.?made for me)\b/i.test(m))         return 'custom_order';
  if (/\b(pay|payment|mpesa|m-pesa|visa|mastercard|paypal|bank|transfer|card|how.*pay|accept.*payment)\b/i.test(m))                   return 'payment';
  if (/\b(price|cost|how much|afford|budget|cheap|expensive|under|below|less than|price range|between|value)\b/i.test(m))             return 'budget';
  if (/\b(ship|deliver|delivery|shipping|how long|when.*arrive|dispatch|track|courier|logistics|international|nairobi|mombasa|kenya)\b/i.test(m)) return 'shipping';
  if (/\b(return|refund|exchange|cancel.*order|broken|damaged|wrong item|complaint|issue|problem|defect)\b/i.test(m))                 return 'returns';
  if (/\b(vendor|sell|seller|artisan|craft|apply.*sell|join.*sell|register.*vendor|become.*vendor|my shop|start.*selling)\b/i.test(m)) return 'vendor';
  if (/\b(affiliate|commission|referral|earn|referral link|partner|promote|marketing|passive income)\b/i.test(m))                     return 'affiliate';
  if (/\b(track|order status|where.*order|my order|order.*number|check.*order)\b/i.test(m))                                           return 'order_tracking';
  if (/\b(account|profile|login|sign.?in|sign.?up|register|password|email|forgot|my details)\b/i.test(m))                            return 'account';
  if (/\b(gift|present|birthday|anniversary|wedding|surprise|for (him|her|them|someone))\b/i.test(m))                                 return 'gift';
  if (/\b(contact|support|help|speak.*human|talk.*person|email.*you|phone|customer service)\b/i.test(m))                              return 'contact';
  if (/\b(discount|coupon|promo|sale|offer|deal|code|voucher)\b/i.test(m))                                                            return 'discount';
  return 'unknown';
};

const detectCategory = (msg) => {
  const m = msg.toLowerCase();
  if (/\b(fashion|cloth|wear|outfit|dress|shirt|jacket|blazer|denim|hoodie)\b/i.test(m)) return 'fashion';
  if (/\b(furniture|chair|table|stool|sofa|desk|shelf|wood|teak|walnut)\b/i.test(m))     return 'furniture';
  if (/\b(bead|jewel|necklace|bracelet|cowrie|obsidian|kente)\b/i.test(m))               return 'beads';
  return null;
};

const RESPONSES = {
  greeting: [
    "Hey there! 👋 Welcome to **57 Arts & Customs** — Africa's premier artisan marketplace!\n\nI can help you discover handcrafted fashion, furniture, and beadwork. I can also answer questions about custom orders, shipping, and payments.\n\nWhat are you looking for today?",
    "Hello! 🌟 Great to have you here!\n\n**57 Arts & Customs** brings you handcrafted pieces from Africa's most talented artisans. From statement fashion to bespoke furniture and traditional beadwork.\n\nHow can I help you today?",
    "Hi! 👋 I'm your **57 Arts AI Concierge** — here to help you find the perfect artisan piece!\n\nTell me what you're looking for — or ask me anything about our products, custom orders, shipping, or payments. ✨",
  ],
  farewell: [
    "Goodbye! 👋 Thanks for visiting **57 Arts & Customs**. Our artisans are always crafting something new — come back soon! 🌟",
    "Take care! 🌟 It was great chatting with you. Browse our full collection at /shop anytime!",
    "Bye for now! 👋 Hope you found what you were looking for. Feel free to come back whenever you need help. ✨",
  ],
  thanks: [
    "You're most welcome! 😊 Is there anything else I can help you with?",
    "Happy to help! 🌟 Feel free to ask me anything else about our products or services.",
    "Anytime! ✨ That's what I'm here for. Anything else you'd like to know?",
  ],
  identity: [
    "I'm the **57 Arts AI Concierge** 🤖 — your personal shopping assistant!\n\nI help customers discover handcrafted artisan pieces, answer questions about orders, shipping, payments, and guide you through the 57 Arts experience.\n\nWhat can I do for you?",
  ],
  about: [
    "**57 Arts & Customs** is Africa's premier multi-vendor marketplace for handcrafted products! 🌍\n\nWe connect talented African artisans with buyers worldwide across three categories:\n\n**👗 Fashion** — Bespoke African-inspired clothing and accessories\n**🪑 Furniture** — Handcrafted wooden furniture and home decor\n**📿 Beadwork** — Traditional and contemporary African jewellery\n\nAll products are handmade by verified artisans. Quality and authenticity guaranteed. 🌟",
  ],
  custom_order: [
    "We love custom orders! 🎨 Here's exactly how it works:\n\n**Step 1 — Submit your brief** at /custom-order\nDescribe your vision: materials, dimensions, style, colour, and timeline\n\n**Step 2 — Receive quotes** within 48 hours\n\n**Step 3 — Approve & production begins**\n\n**Step 4 — Delivery**\nYour bespoke item is delivered directly to you\n\n⏱️ Timelines: 2–8 weeks depending on complexity\n\nReady to commission something special? Head to /custom-order!",
  ],
  payment: [
    "We make payment easy and secure! 💳\n\n**📱 M-Pesa** — STK push to your Safaricom number\n**💳 Visa / Mastercard** — All major cards accepted\n**🅿 PayPal** — Great for international buyers\n**🏦 Bank Transfer** — Direct to Equity Bank Kenya\n\nAll payments are encrypted and secure. Having trouble? Visit /contact.",
  ],
  shipping: [
    "Here's everything you need to know about shipping! 🚚\n\n**🇰🇪 Within Kenya**\n• Nairobi: 1-2 business days\n• Other counties: 2-3 business days\n• Cost: KES 500 (FREE on orders over KES 50,000!)\n\n**🌍 East Africa** — 5-7 business days\n**🌐 International** — 7-14 business days\n\nAll orders include **tracking**. Track anytime at /order-tracking! 📦",
  ],
  returns: [
    "Our returns policy is straightforward! ↩️\n\n**Standard items:** 7-day return window from delivery\n**Damaged/wrong items:** We cover return shipping 100%\n⚠️ **Custom orders** are final sale unless there's a manufacturing defect.\n\nTo start a return, contact us at /contact with your order number.",
  ],
  vendor: [
    "Want to sell your craft on 57 Arts? 🎨\n\n1. Visit /vendor and fill in your artisan profile *(free!)*\n2. Upload portfolio photos\n3. Our team reviews within **48 hours**\n4. Get verified and start listing!\n\n**Why join us?**\n• **8% commission only** — no listing fees\n• **Weekly M-Pesa payouts**\n• **2,400+ active buyers**\n\nVisit /vendor to apply! 🌍",
  ],
  affiliate: [
    "Our affiliate program is a fantastic way to earn! 🔗\n\n1. Register at /affiliate *(free)*\n2. Get your unique referral link\n3. Share it anywhere!\n4. Earn **8% commission** on every sale\n\n**Weekly payouts via M-Pesa or bank transfer** — no minimum threshold!\n\nVisit /affiliate to get started! 💰",
  ],
  order_tracking: [
    "Tracking your order is easy! 📦\n\nJust visit **/order-tracking** while logged in — all your orders will be listed with live status updates.\n\n**Stages:** Pending → Processing → Shipped → Delivered 🎉\n\nNeed help? Share your order number and I'll try to assist!",
  ],
  account: [
    "Here's a quick guide! 👤\n\n**New here?** Register at /register\n**Already have an account?** Log in at /login\n**Forgot password?** Use the reset link on the login page\n**Update your details?** Go to /profile after logging in",
  ],
  gift: [
    "Looking for a gift? You've come to the perfect place! 🎁\n\n**For her:** Fashion pieces, beaded jewellery\n**For him:** Handcrafted furniture, statement pieces\n**For anyone:** A custom order — made just for them!\n\nTell me more about who you're gifting and I'll suggest the perfect piece! 💛",
  ],
  contact: [
    "Need to talk to a real person? We've got you! 📞\n\n• **Contact form:** /contact — we respond within 2-4 hours\n• **Email:** support@57artscustoms.com\n\n**Support hours: Mon-Sat, 8am-6pm EAT.**",
  ],
  discount: [
    "Great question about deals! 🎉\n\n**Free shipping** on orders over KES 50,000 🚚\n**Welcome discount** — check your email after registering!\n**Seasonal sales** — we run promotions during major holidays\n\nEnter coupon codes at checkout! 📧",
  ],
  budget: [
    "We have something beautiful for every budget! 💰\n\n**📿 Beadwork & Accessories:** KES 500 – 15,000\n**👗 Fashion:** KES 2,000 – 80,000\n**🪑 Furniture:** KES 8,000 – 300,000+\n**🎨 Custom orders:** Any budget — just mention your range!\n\nWhat's your budget? I'll find you the best pieces! 🎯",
  ],
  unknown: [
    "Hmm, I'm not sure I caught that! 🤔\n\nHere's what I can help with:\n\n🛍️ **Products** — Fashion, Furniture, Beadwork\n🎨 **Custom orders** — Commission bespoke pieces\n💳 **Payments** — M-Pesa, card, PayPal\n🚚 **Shipping** — Delivery times and costs\n↩️ **Returns** — Our returns policy\n🔗 **Affiliates** — Earn commissions\n📦 **Order tracking** — Check your orders\n\nTry asking: *\"Show me fashion pieces\"* or *\"How do custom orders work?\"*",
  ],
};

const buildProductResponse = async (intent, msg) => {
  const catMap  = { fashion: 'fashion', furniture: 'furniture', beads: 'beads', trending: null, browse: detectCategory(msg) };
  const category = catMap[intent];
  const products = await fetchProducts(category, 3);

  const emojis = { fashion: '👗', furniture: '🪑', beads: '📿' };
  const emoji  = emojis[category] || '✨';

  const intros = {
    fashion:   [`Here are some of our most stunning **Fashion** pieces! ${emoji}\n\nEach item is handcrafted by skilled African artisans:`],
    furniture: [`Beautiful choices ahead! Here's our **Furniture** selection ${emoji}\n\nEvery piece is handcrafted from quality materials:`],
    beads:     [`Our **Beadwork** collection is stunning! ${emoji} Here are some beautiful pieces:`],
    trending:  [`Here's what's **trending** on 57 Arts right now! 🔥\n\nThese are flying off our shelves:`],
    browse:    [`Here are some of our **featured pieces** across categories! ✨\n\nHandpicked just for you:`],
  };

  const introOptions = intros[category] || intros.browse;
  const outro = products.length === 0
    ? `\n\nVisit **/shop** to explore our full collection!`
    : `\n\nBrowse the full collection at **/shop?category=${category || 'all'}** for hundreds more! 🎨`;

  return { text: pick(introOptions) + outro, products };
};

exports.chat = async (req, res) => {
  try {
    const { message, user_id, session_id } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const intent = detectIntent(message);
    let responseText = '';
    let products     = [];

    if (['fashion', 'furniture', 'beads', 'trending', 'browse'].includes(intent)) {
      const result = await buildProductResponse(intent, message);
      responseText = result.text;
      products     = result.products;
    } else {
      responseText = pick(RESPONSES[intent] || RESPONSES.unknown);
    }

    persistChatHistory({ session_id, user_id, userMessage: message.trim(), botResponse: responseText })
      .catch(err => console.error('[ChatHistory] Save error:', err.message));

    return res.json({ response: responseText, products, intent, user_id });

  } catch (err) {
    console.error('[AI] Chat error:', err.message);
    return res.status(200).json({
      response: "Sorry, I'm having a little trouble — please try again! 🙏",
      products: [],
    });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// CHAT HISTORY
// ══════════════════════════════════════════════════════════════════════════════

async function persistChatHistory({ session_id, user_id, userMessage, botResponse }) {
  const sid     = session_id || uuidv4();
  let   session = await ChatHistory.findOne({ sessionId: sid, isActive: true });

  if (session) {
    session.messages.push(
      { role: 'user',      content: userMessage },
      { role: 'assistant', content: botResponse },
    );
    session.updatedAt = new Date();
    await session.save();
  } else {
    await ChatHistory.create({
      sessionId: sid,
      user:      user_id || undefined,
      messages:  [
        { role: 'user',      content: userMessage },
        { role: 'assistant', content: botResponse },
      ],
      isActive: true,
    });
  }
}

exports.getChatHistory = async (req, res) => {
  try {
    const filter = {};
    if (req.query.session_id) filter.sessionId = req.query.session_id;
    if (req.query.user_id)    filter.user       = req.query.user_id;

    const sessions = await ChatHistory.find(filter)
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('sessionId messages createdAt updatedAt');

    res.json({ sessions });
  } catch (err) {
    console.error('[AI] getChatHistory error:', err.message);
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// IMAGE GENERATION — Stability AI  +  Pollinations.AI free fallback
// ══════════════════════════════════════════════════════════════════════════════

const categoryContext = {
  fashion:   'African fashion, bespoke apparel, artisan clothing, fabric textures, cultural garment',
  furniture: 'handcrafted artisan furniture, wood grain, sculptural design, interior piece',
  beads:     'African beadwork, intricate jewelry, traditional beads, luxury accessories',
};

const buildPrompt = (prompt, category) => {
  const context = categoryContext[category] || 'artisan handcrafted product, African craftsmanship';
  return `${prompt.trim()}, ${context}, product concept render, studio lighting, high detail, elegant, dark background`;
};

// ── Strategy 1: Stability AI (paid, high quality) ─────────────────────────────
const generateWithStability = async (enrichedPrompt) => {
  const STABILITY_KEY = process.env.STABILITY_API_KEY;
  if (!STABILITY_KEY) throw new Error('STABILITY_API_KEY not set in environment');

  const form = new FormData();
  form.append('prompt',          enrichedPrompt);
  form.append('negative_prompt', 'blurry, low quality, watermark, text, ugly, distorted');
  form.append('output_format',   'png');
  form.append('aspect_ratio',    '1:1');

  const response = await axios.post(
    'https://api.stability.ai/v2beta/stable-image/generate/core',
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${STABILITY_KEY}`,
        Accept:        'image/*',
      },
      responseType: 'arraybuffer',
      timeout:      60000,
    }
  );

  // If Stability returns a non-image content type, it's an error body
  const contentType = response.headers['content-type'] || '';
  if (!contentType.startsWith('image/')) {
    const decoded = Buffer.from(response.data).toString('utf8');
    console.error('[AI] Stability returned non-image response:', decoded);
    throw new Error(decoded);
  }

  const base64 = Buffer.from(response.data).toString('base64');
  if (!base64) throw new Error('Empty image buffer from Stability AI');

  return `data:image/png;base64,${base64}`;
};

// ── Strategy 2: Pollinations.AI (free, no key needed) ─────────────────────────
const generateWithPollinations = async (enrichedPrompt) => {
  const encoded = encodeURIComponent(enrichedPrompt);
  // Returns the image directly as a binary stream
  const response = await axios.get(
    `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true`,
    { responseType: 'arraybuffer', timeout: 60000 }
  );

  const base64 = Buffer.from(response.data).toString('base64');
  if (!base64) throw new Error('Empty image buffer from Pollinations');

  const mimeType = response.headers['content-type'] || 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
};

// ── Main export ────────────────────────────────────────────────────────────────
// POST /api/ai/generate-image  { prompt, category }
exports.generateImage = async (req, res) => {
  const { prompt, category } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const enrichedPrompt = buildPrompt(prompt, category);
  console.log('[AI] Generating image | category:', category || 'general');
  console.log('[AI] Prompt:', enrichedPrompt.slice(0, 100) + '...');

  // ── Try Stability AI first ──────────────────────────────────────────────────
  try {
    const image = await generateWithStability(enrichedPrompt);
    console.log('[AI] ✅ Stability AI generated successfully');
    return res.json({ success: true, image, provider: 'stability' });

  } catch (stabilityErr) {
    const errMsg = decodeStabilityError(stabilityErr);
    const status  = stabilityErr.response?.status;

    console.warn(`[AI] ⚠️ Stability AI failed (HTTP ${status || 'N/A'}): ${errMsg}`);

    // Surface clear credit/auth errors to the user without falling back
    if (status === 401) {
      return res.status(401).json({ error: 'Stability AI API key is invalid. Please check your STABILITY_API_KEY.' });
    }
    if (status === 402 || errMsg.toLowerCase().includes('credit') || errMsg.toLowerCase().includes('balance')) {
      console.warn('[AI] Stability credits exhausted — switching to free fallback (Pollinations.AI)');
      // Fall through to Pollinations below
    }
    // For any other Stability failure, also try Pollinations as a fallback
  }

  // ── Fallback: Pollinations.AI (free, no credits needed) ────────────────────
  try {
    console.log('[AI] Trying Pollinations.AI fallback...');
    const image = await generateWithPollinations(enrichedPrompt);
    console.log('[AI] ✅ Pollinations.AI generated successfully');
    return res.json({ success: true, image, provider: 'pollinations' });

  } catch (pollinationsErr) {
    console.error('[AI] ❌ Pollinations.AI also failed:', pollinationsErr.message);
    return res.status(500).json({
      error: 'Image generation is currently unavailable. Please try again later.',
    });
  }
};