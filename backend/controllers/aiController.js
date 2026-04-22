const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const ChatHistory = require('../models/ChatHistory');
const Product = require('../models/Product');

const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// ── Helpers ───────────────────────────────────────────────────────────────────

// Builds a lookup map keyed by both _id (string) and slug so we can hydrate
// AI service responses regardless of which identifier they include.
const buildDbMap = (dbProducts) => {
  const map = {};
  dbProducts.forEach(p => {
    if (p._id)  map[String(p._id)] = p;
    if (p.slug) map[p.slug]        = p;
  });
  return map;
};

// Returns the first valid http image URL from a recommendation object,
// then falls back to the matched DB record. Returns null (never '') so the
// frontend resolveImage() picks the correct category placeholder.
const resolveImg = (r, dbRecord) =>
  [r.img, r.image, r.imageUrl, r.thumbnail, dbRecord?.images?.[0]]
    .find(v => v && typeof v === 'string' && v.startsWith('http')) || null;

// Normalises a raw AI-service recommendation into the shape the frontend needs.
const normaliseRec = (r, dbMap) => {
  const bySlug = r.slug ? dbMap[r.slug] : null;
  const byId   = (r._id || r.id) ? dbMap[String(r._id || r.id)] : null;
  const db     = bySlug || byId || null;
  return {
    _id:      r._id      || db?._id,
    id:       r.id       || r.slug     || String(r._id || ''),
    name:     r.name     || db?.name,
    category: r.category || db?.category,
    price:    r.price    || db?.price,
    slug:     r.slug     || db?.slug,
    tag:      r.tag      || db?.tag    || null,
    reason:   r.reason   || null,
    img:      resolveImg(r, db),
  };
};

// ── Recommendations ───────────────────────────────────────────────────────────
exports.getRecommendations = async (req, res) => {
  try {
    const { user_id, category, n = 6 } = req.query;
    const params = new URLSearchParams({ n });
    if (user_id)  params.append('user_id',  user_id);
    if (category) params.append('category', category);

    const { data } = await axios.get(`${AI_SERVICE}/recommendations?${params}`);
    const recs = data?.recommendations || [];

    if (recs.length) {
      // Collect every identifier the AI service might have returned
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
    // ── DB fallback when AI service is unreachable ────────────────────────────
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

// ── Fetch real products (used by chat handler) ────────────────────────────────
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

// ── Pick random from array ────────────────────────────────────────────────────
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ── Intent detection ──────────────────────────────────────────────────────────
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

// ── Response bank ─────────────────────────────────────────────────────────────
const RESPONSES = {
  greeting: [
    "Hey there! 👋 Welcome to **57 Arts & Customs** — Africa's premier artisan marketplace!\n\nI can help you discover handcrafted fashion, furniture, and beadwork. I can also answer questions about custom orders, shipping, and payments.\n\nWhat are you looking for today?",
    "Hello! 🌟 Great to have you here!\n\n**57 Arts & Customs** brings you handcrafted pieces from Africa's most talented artisans. From statement fashion to bespoke furniture and traditional beadwork.\n\nHow can I help you today?",
    "Hi! 👋 I'm your **57 Arts AI Concierge** — here to help you find the perfect artisan piece!\n\nTell me what you're looking for — or ask me anything about our products, custom orders, shipping, or payments. ✨",
    "Hey! 🎨 Welcome to **57 Arts & Customs**!\n\nWe celebrate African craftsmanship through fashion, furniture, and jewellery. Each piece is made by hand by skilled artisans.\n\nWhat brings you here today?",
  ],
  farewell: [
    "Goodbye! 👋 Thanks for visiting **57 Arts & Customs**. Our artisans are always crafting something new — come back soon! 🌟",
    "Take care! 🌟 It was great chatting with you. Browse our full collection at /shop anytime!",
    "Bye for now! 👋 Hope you found what you were looking for. Feel free to come back whenever you need help. ✨",
    "See you soon! 🎨 Don't forget — you can always start a custom order if you want something made just for you!",
  ],
  thanks: [
    "You're most welcome! 😊 Is there anything else I can help you with?",
    "Happy to help! 🌟 Feel free to ask me anything else about our products or services.",
    "Anytime! ✨ That's what I'm here for. Anything else you'd like to know?",
    "My pleasure! 😊 Let me know if there's anything else — I'm always here to help.",
    "Glad I could help! 🎨 Don't hesitate to ask if you have more questions.",
  ],
  identity: [
    "I'm the **57 Arts AI Concierge** 🤖 — your personal shopping assistant!\n\nI help customers discover handcrafted artisan pieces, answer questions about orders, shipping, payments, and guide you through the 57 Arts experience.\n\nI'm smart enough to understand your needs, but I'll always be honest — I'm an AI, not a human. What can I do for you?",
    "Great question! I'm an **AI assistant** built specifically for **57 Arts & Customs** 🎨\n\nI know everything about our products, artisans, custom order process, shipping, and payments. Think of me as your personal marketplace guide!\n\nWhat would you like to explore?",
  ],
  about: [
    "**57 Arts & Customs** is Africa's premier multi-vendor marketplace for handcrafted products! 🌍\n\nWe connect talented African artisans with buyers worldwide across three categories:\n\n**👗 Fashion** — Bespoke African-inspired clothing and accessories\n**🪑 Furniture** — Handcrafted wooden furniture and home decor\n**📿 Beadwork** — Traditional and contemporary African jewellery\n\nWe also support **custom orders** — commission a piece made exactly to your vision!\n\nAll products are handmade by verified artisans. Quality and authenticity guaranteed. 🌟",
    "We're **57 Arts & Customs** 🎨 — a marketplace celebrating African craftsmanship!\n\nFounded to give talented artisans a global platform, we feature:\n• Handcrafted fashion pieces\n• Bespoke furniture and home decor\n• Traditional and contemporary beadwork\n• Custom commissioned pieces\n\n**2,400+ happy buyers | 340+ verified artisans | 50+ countries reached**\n\nEvery purchase supports an African artisan directly! 💛",
  ],
  custom_order: [
    "We love custom orders! 🎨 Here's exactly how it works:\n\n**Step 1 — Submit your brief** at /custom-order\nDescribe your vision: materials, dimensions, style, colour, and timeline\n\n**Step 2 — Receive quotes** within 48 hours\nOur artisans review your brief and send personalised quotes\n\n**Step 3 — Approve & production begins**\nChoose your artisan and they start crafting your piece\n\n**Step 4 — Delivery**\nYour bespoke item is delivered directly to you\n\n⏱️ Timelines: 2–8 weeks depending on complexity\n💰 Budget: Any — just mention your range in the brief\n\nReady to commission something special? Head to /custom-order!",
    "Custom orders are one of our specialities! ✦\n\nThe process is simple:\n1️⃣ **Tell us your vision** — materials, size, style, colours\n2️⃣ **Artisans quote you** — usually within 48 hours\n3️⃣ **You approve** — production starts immediately\n4️⃣ **Delivered to you** — beautifully packaged\n\nWe've handled everything from custom Akan throne chairs to personalised furniture sets. No request is too unique!\n\nVisit /custom-order to get started. 🌟",
  ],
  payment: [
    "We make payment easy and secure! 💳 Here's what we accept:\n\n**📱 M-Pesa** — STK push to your Safaricom number. Most popular in Kenya — instant and simple!\n**💳 Visa / Mastercard** — All major credit and debit cards accepted\n**🅿 PayPal** — Great for international buyers\n**🏦 Bank Transfer** — Direct to Equity Bank Kenya\n\nAll payments are encrypted and secure. Payment confirmation is instant!\n\nHaving trouble with a payment? Visit /contact for help.",
    "Great news — we support multiple payment methods! 💰\n\n**In Kenya:** M-Pesa is our most popular option — just enter your number at checkout and confirm the STK push on your phone. Done in seconds!\n\n**International:** Visa, Mastercard, or PayPal work perfectly.\n\n**Bank transfer** is also available for larger orders.\n\nAll transactions are secure and you get instant confirmation. Need help with checkout?",
  ],
  shipping: [
    "Here's everything you need to know about shipping! 🚚\n\n**🇰🇪 Within Kenya**\n• Nairobi: 1-2 business days\n• Other counties: 2-3 business days\n• Cost: KES 500 (FREE on orders over KES 50,000!)\n\n**🌍 East Africa** (Uganda, Tanzania, Rwanda)\n• 5-7 business days\n\n**🌐 International**\n• 7-14 business days\n• Cost varies by destination\n\nAll orders include **tracking**. You'll get a tracking number via email once dispatched. Track anytime at /order-tracking! 📦",
    "Shipping info! 📦\n\nWe deliver **everywhere** — from Nairobi to New York!\n\n**Local (Kenya):** 2-3 days | KES 500\n**Free shipping** on orders above KES 50,000! 🎉\n**East Africa:** 5-7 days\n**International:** 7-14 days\n\nEvery order is carefully packaged to protect your artisan piece. You'll receive a tracking number as soon as your order ships.\n\nTrack your order at /order-tracking anytime. Where are you shipping to?",
  ],
  returns: [
    "Our returns policy is straightforward! ↩️\n\n**Standard items:**\n• 7-day return window from delivery date\n• Item must be unused and in original packaging\n• Refund processed in 5-7 business days\n\n**Damaged or wrong items:**\n• We cover return shipping 100%\n• Replacement or full refund — your choice\n• Resolved within 24-48 hours\n\n⚠️ **Custom/bespoke orders** are final sale (unless there's a manufacturing defect). This is because they're made specifically for you!\n\nTo start a return, contact us at /contact with your order number.",
    "Returns are easy with us! Here's how it works:\n\n✅ **7 days** to return from delivery\n✅ Items must be unused and undamaged\n✅ Refunds in 5-7 business days\n✅ Damaged items: we replace or refund immediately\n\n❌ Custom orders are **non-refundable** (made specifically for you)\n\nJust reach out at /contact with your order number and reason. We'll handle the rest! 😊",
  ],
  vendor: [
    "Want to sell your craft on 57 Arts? 🎨 We'd love to have you!\n\n**Here's how to join:**\n1. Visit /vendor and fill in your artisan profile *(free!)*\n2. Upload portfolio photos of your work\n3. Our team reviews within **48 hours**\n4. Get verified and start listing your products\n5. Receive orders and get paid! 💰\n\n**Why join us?**\n• **8% commission only** — no listing fees, no monthly subscriptions\n• **Weekly M-Pesa payouts** direct to your phone\n• **2,400+ active buyers** already on the platform\n• **Custom order system** — handle bespoke commissions easily\n\nReady to share your craft with the world? Visit /vendor to apply! 🌍",
    "Selling on 57 Arts is simple and free to start! 🌟\n\n**What you get as a vendor:**\n• Your own storefront on Africa's top artisan marketplace\n• Access to thousands of buyers locally and internationally\n• Easy order management dashboard\n• Weekly payouts via M-Pesa or bank transfer\n• Custom order tools to handle bespoke commissions\n• Sales analytics and insights\n\n**Cost:** Just **8%** commission on sales. Nothing else!\n\nApply at /vendor — approval takes 48 hours. 🎨",
  ],
  affiliate: [
    "Our affiliate program is a fantastic way to earn! 🔗\n\n**How it works:**\n1. Register as an affiliate at /affiliate *(free)*\n2. Get your unique referral link\n3. Share it on social media, WhatsApp, blogs, anywhere!\n4. Earn **8% commission** on every sale through your link\n\n**The perks:**\n• Real-time dashboard — track clicks, sales & earnings\n• Weekly payouts via M-Pesa or bank transfer\n• No minimum payout threshold\n• Dedicated support for affiliates\n\nIt's perfect for content creators, influencers, or anyone with an audience! Ready to start earning? Visit /affiliate 💰",
    "Affiliate marketing with 57 Arts pays well! 💛\n\n**Earn 8% commission** on every sale you refer — no cap on earnings!\n\nHere's the deal:\n✅ Free to join at /affiliate\n✅ Unique tracking link for every affiliate\n✅ Works on all products — fashion, furniture, beads\n✅ Weekly M-Pesa payouts\n✅ Transparent earnings dashboard\n\nSome of our top affiliates earn KES 20,000+ monthly just from sharing links. Interested?",
  ],
  order_tracking: [
    "Tracking your order is easy! 📦\n\nJust visit **/order-tracking** while logged in — all your orders will be listed with live status updates.\n\n**Your order goes through these stages:**\n📋 **Pending** — Payment confirmed, order received\n⚙️ **Processing** — Your artisan is crafting the piece\n🚚 **Shipped** — On its way! You'll get a tracking number\n📦 **Delivered** — Enjoy your piece! 🎉\n\nYou can also **cancel orders** (before shipping) or **download invoices** from the tracking page.\n\nNeed help with a specific order number? Share it and I'll try to assist!",
    "To track your order, head to **/order-tracking** and log in with your account. 🔍\n\nYou'll see all your orders with:\n• Current status with timeline\n• Estimated delivery date\n• Tracking number (once shipped)\n• Option to cancel (if not yet shipped)\n• Invoice download\n\nYou can also chat with your artisan from the order tracking page!\n\nDo you have a specific order you're concerned about?",
  ],
  account: [
    "Here's a quick guide to account management! 👤\n\n**New here?** Register at /register — it takes 2 minutes!\n• You'll receive a 6-digit email verification code\n• Verify your email to activate your account\n\n**Already have an account?** Log in at /login\n\n**Forgot password?** Use the reset link on the login page\n\n**Update your details?** Go to /profile after logging in — you can update your name, phone, address, and profile picture\n\n**Email not verified?** We can resend your verification code — just log in and follow the prompts!\n\nNeed help with something specific?",
  ],
  gift: [
    "Looking for a gift? You've come to the perfect place! 🎁\n\nOur handcrafted pieces make incredibly unique and meaningful gifts. Here are some popular choices:\n\n**For her:** Fashion pieces, beaded jewellery, decorative accessories\n**For him:** Handcrafted furniture, statement pieces, unique home decor\n**For the home:** Custom furniture, wall art, decorative objects\n**For anyone:** A custom order — we'll make something just for them!\n\nWould you like me to show you pieces in a specific category? Or tell me more about who you're gifting and I'll suggest the perfect piece! 💛",
    "Gift shopping at 57 Arts is special because every piece is handmade! 🎁✨\n\nSome of our most gifted items:\n📿 **Beaded jewellery** — timeless, beautiful, uniquely African\n👗 **Fashion pieces** — statement clothing they'll treasure\n🪑 **Artisan furniture** — a gift that lasts a lifetime\n🎨 **Custom commission** — the most personal gift possible\n\nWe can also include a personalised gift message with your order!\n\nWho's the lucky person? Tell me more and I'll help you find the perfect piece! 💛",
  ],
  contact: [
    "Need to talk to a real person? We've got you! 📞\n\n**Ways to reach us:**\n• **Contact form:** /contact — we respond within 2-4 hours\n• **Email:** support@57artscustoms.com\n• **Artisan chat:** For order-specific questions, use /artisan-chat\n\n**Common issues we help with:**\n• Order problems or disputes\n• Custom order questions\n• Vendor applications\n• Technical issues\n• Refund requests\n\nOur support team is available **Mon-Sat, 8am-6pm EAT**. What do you need help with?",
  ],
  discount: [
    "Great question about deals! 🎉\n\nHere's how to save on 57 Arts:\n\n**Free shipping** on all orders over KES 50,000 🚚\n**Coupon codes** — check your email after registering for a welcome discount!\n**Seasonal sales** — we run promotions during major holidays\n**Affiliate discounts** — some affiliates share exclusive discount codes\n\nAt checkout, there's a coupon code field where you can enter any active codes.\n\nWant to be the first to know about deals? Make sure your account email is verified — we send promotions there! 📧",
  ],
  budget: [
    "We have something beautiful for every budget! 💰\n\nHere's a rough price guide:\n\n**📿 Beadwork & Accessories:** KES 500 – 15,000\n**👗 Fashion:** KES 2,000 – 80,000\n**🪑 Furniture:** KES 8,000 – 300,000+\n**🎨 Custom orders:** Any budget — just mention your range!\n\n**Free shipping** on orders over KES 50,000! 🎉\n\nWhat's your budget range? Tell me and I'll show you the best pieces in that price range! 🎯",
    "Good thinking to consider your budget! 💡\n\nOur price range is very wide:\n• **Affordable picks** from KES 500 (beadwork accessories)\n• **Mid-range** KES 5,000–30,000 (fashion, small furniture)\n• **Premium** KES 30,000+ (statement furniture, bespoke pieces)\n\nFor **custom orders**, you set your budget and artisans quote within it.\n\nWhat price range works for you? I'll find you the best options! 🛍️",
  ],
  unknown: [
    "Hmm, I'm not sure I caught that! 🤔\n\nHere's what I can help you with:\n\n🛍️ **Products** — Fashion, Furniture, Beadwork\n🎨 **Custom orders** — Commission bespoke pieces\n💳 **Payments** — M-Pesa, card, PayPal\n🚚 **Shipping** — Delivery times and costs\n↩️ **Returns** — Our returns policy\n🔗 **Affiliates** — Earn commissions\n🏪 **Vendors** — Sell your craft\n📦 **Order tracking** — Check your orders\n\nTry asking something like: *\"Show me fashion pieces\"*, *\"How do custom orders work?\"*, or *\"What payment methods do you accept?\"*",
    "I'm not quite sure about that one! 😅\n\nCould you rephrase your question? I understand things like:\n• \"Show me trending furniture\"\n• \"How do I pay with M-Pesa?\"\n• \"What's your return policy?\"\n• \"I want something custom made\"\n• \"How long does shipping take?\"\n\nOr if you need specific help, reach out to our team at /contact! 😊",
    "That's a bit outside my expertise! 🤔\n\nI specialise in helping you with **57 Arts & Customs** — products, orders, shipping, payments, and more.\n\nFor anything more complex, our support team at /contact would be happy to help!\n\nOtherwise, try asking me about our products or services — I know this platform inside out! 🌟",
  ],
};

// ── Build product response ────────────────────────────────────────────────────
const buildProductResponse = async (intent, msg) => {
  const catMap = { fashion: 'fashion', furniture: 'furniture', beads: 'beads', trending: null, browse: detectCategory(msg) };
  const category = catMap[intent];
  const products = await fetchProducts(category, 3);

  const emojis = { fashion: '👗', furniture: '🪑', beads: '📿' };
  const emoji  = emojis[category] || '✨';

  const intros = {
    fashion: [
      `Here are some of our most stunning **Fashion** pieces! ${emoji}\n\nEach item is handcrafted by skilled African artisans:`,
      `Loving your taste in fashion! ${emoji} Here are some handpicked pieces from our collection:`,
      `Our fashion collection is truly special! ${emoji} Check out these artisan-crafted pieces:`,
    ],
    furniture: [
      `Beautiful choices ahead! Here's our **Furniture** selection ${emoji}\n\nEvery piece is handcrafted from quality materials:`,
      `Our artisans make incredible furniture! ${emoji} Here are some standout pieces:`,
      `Here's some of our finest **Furniture** — handcrafted with love ${emoji}:`,
    ],
    beads: [
      `Our **Beadwork** collection is stunning! ${emoji} Here are some beautiful pieces:`,
      `Traditional African beadwork with a modern twist! ${emoji} Check these out:`,
      `Gorgeous handcrafted **Beadwork** for you ${emoji}:`,
    ],
    trending: [
      `Here's what's **trending** on 57 Arts right now! 🔥\n\nThese are flying off our shelves:`,
      `Hot picks! 🌟 These are our most popular pieces right now:`,
      `Trending now on **57 Arts & Customs** 🔥 — don't miss these:`,
    ],
    browse: [
      `Here are some of our **featured pieces** across categories! ✨\n\nHandpicked just for you:`,
      `Let me show you some of our best work! 🌟 Here are some featured pieces:`,
      `Exploring 57 Arts? Start here! ✨ These are some of our finest pieces:`,
    ],
  };

  const outros = [
    `\n\nBrowse the full **{cat}** collection at **/shop?category={cat}** for hundreds more! 🎨`,
    `\n\nExplore hundreds more **{cat}** pieces at **/shop?category={cat}** 🛍️`,
    `\n\nLove these? See the full **{cat}** collection at **/shop?category={cat}** ✨`,
    `\n\nJust a taste! Visit **/shop?category={cat}** for everything. 🌟`,
  ];

  const introOptions = intros[category] || intros.browse;
  const text = pick(introOptions) + (products.length === 0
    ? `\n\nVisit **/shop** to explore our full collection!`
    : pick(outros));

  return { text, products };
};

// ── Main chat handler ─────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
  try {
    const { message, user_id, history = [], session_id } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const intent = detectIntent(message);
    let responseText = '';
    let products = [];

    if (['fashion', 'furniture', 'beads', 'trending', 'browse'].includes(intent)) {
      const result = await buildProductResponse(intent, message);
      responseText = result.text;
      products     = result.products;
    } else {
      const options = RESPONSES[intent] || RESPONSES.unknown;
      responseText  = pick(options);
    }

    persistChatHistory({ session_id, user_id, userMessage: message.trim(), botResponse: responseText })
      .catch(err => console.error('[ChatHistory] Save error:', err.message));

    return res.json({ response: responseText, products, intent, user_id });

  } catch (err) {
    console.error('[AI] Chat error:', err.message);
    return res.status(200).json({ response: "Sorry, I'm having a little trouble — please try again! 🙏", products: [] });
  }
};

// ── Persist chat history ──────────────────────────────────────────────────────
async function persistChatHistory({ session_id, user_id, userMessage, botResponse }) {
  const sid = session_id || uuidv4();
  let session = await ChatHistory.findOne({ sessionId: sid, isActive: true });
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
      user: user_id || undefined,
      messages: [
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
    res.status(500).json({ error: 'Could not fetch chat history' });
  }
};