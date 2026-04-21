from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional, List
import pandas as pd

app = FastAPI(title="57 Arts Recommendation & Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Products ──────────────────────────────────────────────────────────────────
PRODUCTS = [
    {"id": "p1",  "name": "Obsidian Throne v.2",        "category": "Furniture", "price": 12000, "tag": "Custom",  "slug": "obsidian-throne-v2",        "img": "/assets/products/obsidian-throne-v2.jpg"},
    {"id": "p2",  "name": "Midnight Denim Jacket",       "category": "Fashion",   "price": 1500,  "tag": "Limited", "slug": "midnight-denim-jacket",       "img": "/assets/products/midnight-denim-jacket.jpg"},
    {"id": "p3",  "name": "Gold Pulse Beads",            "category": "Beads",     "price": 2500,  "tag": "New",     "slug": "gold-pulse-beads",            "img": "/assets/products/gold-pulse-beads.jpg"},
    {"id": "p4",  "name": "Monarch Carry-all",           "category": "Fashion",   "price": 2000,  "tag": "Hot",     "slug": "monarch-carry-all",           "img": "/assets/products/monarch-carry-all.jpg"},
    {"id": "p5",  "name": "Distressed Denim Trouser",    "category": "Fashion",   "price": 3000,  "tag": "Hot",     "slug": "distressed-denim-trouser",    "img": "/assets/products/distressed-denim-trouser.jpg"},
    {"id": "p6",  "name": "Vanguard Teak Chair",         "category": "Furniture", "price": 12000, "tag": "Custom",  "slug": "vanguard-teak-chair",         "img": "/assets/products/vanguard-teak-chair.jpg"},
    {"id": "p7",  "name": "Gold-Infused Obsidian Beads", "category": "Beads",     "price": 2500,  "tag": "New",     "slug": "gold-infused-obsidian-beads", "img": "/assets/products/gold-infused-obsidian-beads.jpg"},
    {"id": "p8",  "name": "Midnight Velvet Blazer",      "category": "Fashion",   "price": 2000,  "tag": "Limited", "slug": "midnight-velvet-blazer",      "img": "/assets/products/midnight-velvet-blazer.jpg"},
    {"id": "p9",  "name": "Kente Print Hoodie",          "category": "Fashion",   "price": 3500,  "tag": "New",     "slug": "kente-print-hoodie",          "img": "/assets/products/kente-print-hoodie.jpg"},
    {"id": "p10", "name": "Ankara Accent Stool",         "category": "Furniture", "price": 8500,  "tag": "Custom",  "slug": "ankara-accent-stool",         "img": "/assets/products/ankara-accent-stool.jpg"},
    {"id": "p11", "name": "Heritage Cowrie Necklace",    "category": "Beads",     "price": 1800,  "tag": "Hot",     "slug": "heritage-cowrie-necklace",    "img": "/assets/products/heritage-cowrie-necklace.jpg"},
    {"id": "p12", "name": "Woven Leather Sandals",       "category": "Fashion",   "price": 4500,  "tag": "Limited", "slug": "woven-leather-sandals",       "img": "/assets/products/woven-leather-sandals.jpg"},
]

SLUG_TO_ID  = {p["slug"]: p["id"] for p in PRODUCTS}
PRODUCT_MAP = {p["id"]: p for p in PRODUCTS}

# ── Seed interactions ─────────────────────────────────────────────────────────
RAW_INTERACTIONS = [
    {"user": "u1",  "product": "p2",  "score": 3},
    {"user": "u1",  "product": "p4",  "score": 2},
    {"user": "u1",  "product": "p5",  "score": 3},
    {"user": "u1",  "product": "p8",  "score": 1},
    {"user": "u2",  "product": "p1",  "score": 3},
    {"user": "u2",  "product": "p6",  "score": 3},
    {"user": "u2",  "product": "p10", "score": 2},
    {"user": "u3",  "product": "p3",  "score": 3},
    {"user": "u3",  "product": "p7",  "score": 3},
    {"user": "u3",  "product": "p11", "score": 3},
    {"user": "u4",  "product": "p2",  "score": 2},
    {"user": "u4",  "product": "p4",  "score": 3},
    {"user": "u4",  "product": "p12", "score": 2},
    {"user": "u5",  "product": "p1",  "score": 2},
    {"user": "u5",  "product": "p9",  "score": 3},
    {"user": "u5",  "product": "p11", "score": 2},
    {"user": "u6",  "product": "p6",  "score": 2},
    {"user": "u6",  "product": "p10", "score": 3},
    {"user": "u6",  "product": "p7",  "score": 2},
    {"user": "u7",  "product": "p2",  "score": 1},
    {"user": "u7",  "product": "p5",  "score": 2},
    {"user": "u7",  "product": "p8",  "score": 3},
    {"user": "u7",  "product": "p12", "score": 3},
    {"user": "u8",  "product": "p3",  "score": 2},
    {"user": "u8",  "product": "p7",  "score": 2},
    {"user": "u8",  "product": "p4",  "score": 3},
    {"user": "u9",  "product": "p1",  "score": 3},
    {"user": "u9",  "product": "p10", "score": 3},
    {"user": "u10", "product": "p2",  "score": 1},
    {"user": "u10", "product": "p3",  "score": 2},
    {"user": "u10", "product": "p6",  "score": 2},
    {"user": "u10", "product": "p9",  "score": 3},
]

_live_interactions: dict = {}

def build_matrix():
    merged = {}
    for row in RAW_INTERACTIONS:
        merged[(row["user"], row["product"])] = float(row["score"])
    for (uid, pid), score in _live_interactions.items():
        merged[(uid, pid)] = float(score)

    all_users    = list(set(k[0] for k in merged))
    all_products = [p["id"] for p in PRODUCTS]
    df = pd.DataFrame(0.0, index=all_users, columns=all_products)
    for (uid, pid), score in merged.items():
        if uid in df.index and pid in df.columns:
            df.loc[uid, pid] = score
    return df

# ── Chatbot knowledge base ────────────────────────────────────────────────────
# Each intent has: keywords (substring match) + phrases (exact phrase match, higher priority)
INTENTS = {
    "greeting": {
        "keywords": ["hello", "hi", "hey", "howdy", "sup", "good morning", "good afternoon", "good evening"],
        "response": "Hello! Welcome to 57 Arts & Customs 🎨 I'm your AI assistant. How can I help you today? You can ask me about products, shipping, payments, or customization.",
    },
    "shipping": {
        "keywords": ["shipping", "delivery", "how long", "arrive", "dispatch", "when will", "how soon", "days to deliver"],
        "response": "We deliver across Kenya in 3–5 business days 🚚 Nairobi orders may arrive sooner. International shipping is available on request. You can track your order from your profile dashboard.",
    },
    "returns": {
        "keywords": ["return", "refund", "exchange", "money back", "cancel order", "send back", "return policy"],
        "response": "We accept returns within 7 days of delivery for unused items in original condition 📦 Custom/personalized orders are non-refundable unless there's a defect. Contact support to initiate a return.",
    },
    "payment": {
        "keywords": ["pay", "payment", "mpesa", "m-pesa", "card", "cash", "paypal", "visa", "mastercard", "how to pay", "payment method"],
        "response": "We accept M-Pesa 📱, Visa/Mastercard 💳, PayPal, and Cash on Delivery. All payments are secure and encrypted. M-Pesa is the most popular option for Kenyan customers.",
    },
    "custom": {
        "keywords": ["custom", "customise", "customize", "personalise", "personalize", "bespoke", "made to order", "make for me", "special order"],
        "response": "We love custom orders! 🎨 Most of our products can be personalized — choose your colors, materials, sizes, or add special instructions. Visit any product page and look for the customization options.",
    },
    "categories": {
        "keywords": ["what do you sell", "what products", "categories", "antiques", "what can i buy", "your products", "product range"],
        "response": "We specialize in: 👗 Fashion (jackets, hoodies, sandals), 🪑 Furniture (chairs, stools, thrones), 📿 Beads & Jewelry, and 🏺 Antiques. All handcrafted by verified Kenyan artisans.",
    },
    "fashion": {
        "keywords": ["fashion", "clothing", "clothes", "jacket", "blazer", "denim", "trouser", "hoodie", "sandal", "outfit", "wear", "dress"],
        "response": "Our Fashion collection features handcrafted pieces 👗 — from the Midnight Denim Jacket (KES 1,500) to the Kente Print Hoodie (KES 3,500) and Woven Leather Sandals (KES 4,500). Each piece is unique and made by Kenyan artisans.",
    },
    "furniture": {
        "keywords": ["furniture", "chair", "stool", "table", "throne", "sofa", "teak", "wood", "seating", "home decor"],
        "response": "Our Furniture collection features stunning handcrafted pieces 🪑 — including the Obsidian Throne v.2 (KES 12,000), Vanguard Teak Chair (KES 12,000), and Ankara Accent Stool (KES 8,500). Custom sizing and finishes available!",
    },
    "beads": {
        "keywords": ["bead", "beads", "jewelry", "jewellery", "necklace", "cowrie", "accessory", "accessories"],
        "response": "Our Beads & Jewelry collection is stunning 📿 — featuring Gold Pulse Beads (KES 2,500), Gold-Infused Obsidian Beads (KES 2,500), and the Heritage Cowrie Necklace (KES 1,800). Perfect as gifts or personal statement pieces.",
    },
    "vendor": {
        "keywords": ["sell", "vendor", "become a seller", "list products", "open shop", "sell on", "start selling", "register as seller"],
        "response": "Want to sell on 57 Arts? 🛍️ Register as a vendor, set up your store profile, and start listing your products. We charge a small commission per sale. Go to Register and select 'Vendor' role.",
    },
    "affiliate": {
        "keywords": ["affiliate", "earn", "commission", "refer", "referral", "make money", "earn money", "affiliate program"],
        "response": "Join our affiliate program and earn commissions! 💰 Share your unique affiliate link, earn up to 15% on every sale you refer. Go to Register and select 'Affiliate' role to get started.",
    },
    "contact": {
        "keywords": ["contact", "support", "email", "phone", "reach", "whatsapp", "talk to", "speak to", "customer service"],
        "response": "You can reach our support team at support@57artscustoms.com 📧 or via WhatsApp. We're available Monday–Saturday, 8am–6pm EAT.",
    },
    "order": {
        "keywords": ["track order", "where is my order", "order status", "my order", "order history", "track my"],
        "response": "To track your order, log in and visit your Profile → Order History 📋 You'll see real-time status updates there. If you need help with a specific order, please contact support.",
    },
    "price": {
        "keywords": ["price", "cost", "how much", "pricing", "expensive", "cheap", "affordable", "budget"],
        "response": "Our prices range from KES 1,500 to KES 12,000 depending on the item 💰 Fashion starts from KES 1,500, Beads from KES 1,800, and Furniture from KES 8,500. Custom orders may have different pricing. Check any product page for exact prices.",
    },
    "thanks": {
        "keywords": ["thank", "thanks", "thank you", "appreciate", "great", "awesome", "perfect", "nice", "helpful"],
        "response": "You're welcome! 😊 Is there anything else I can help you with? Feel free to browse our collections or ask me anything.",
    },
}

DEFAULT_RESPONSE = "I'm not sure I understand that question 🤔 I can help with: shipping, returns, payments, customization, product categories, becoming a vendor, or our affiliate program. What would you like to know?"


def detect_intent(message: str) -> Optional[str]:
    """Return the best-matching intent key, or None."""
    msg = message.lower().strip()
    # Remove common punctuation that breaks substring matching
    for ch in ["'", "'", "?", "!", ".", ","]:
        msg = msg.replace(ch, " ")
    msg = " " + msg + " "  # pad so we can do whole-word-ish matching

    for intent, data in INTENTS.items():
        for kw in data["keywords"]:
            if kw in msg:
                return intent
    return None


def get_chat_response(message: str, history: List[dict]) -> str:
    """
    Resolve intent from current message, with fallback context from history.
    history: list of {role, content} dicts (most recent last).
    """
    intent = detect_intent(message)

    # If no intent found, try to infer from recent history (last 3 user messages)
    if not intent and history:
        recent_user_msgs = [
            h["content"] for h in history[-6:]
            if h.get("role") == "user"
        ]
        for past_msg in reversed(recent_user_msgs):
            intent = detect_intent(past_msg)
            if intent:
                break

    if intent:
        return INTENTS[intent]["response"]

    # Specific product name match (only match full product name, not partial words)
    msg_lower = message.lower()
    for product in PRODUCTS:
        if product["name"].lower() in msg_lower:
            return (
                f"You're asking about **{product['name']}**! 🛍️ "
                f"It's in our {product['category']} category, priced at KES {product['price']:,}. "
                f"You can view it at /products/{product['slug']}"
            )

    return DEFAULT_RESPONSE


# ── Pydantic models ───────────────────────────────────────────────────────────
class HistoryMessage(BaseModel):
    role: str
    content: str

class InteractionPayload(BaseModel):
    user_id:    str
    product_id: str
    action:     str  # "view" | "cart" | "purchase"

class ChatPayload(BaseModel):
    message: str
    user_id: Optional[str] = None
    # FIX: never use mutable default [] in Python — use None + default in validator
    history: Optional[List[HistoryMessage]] = Field(default_factory=list)

# ── Helpers ───────────────────────────────────────────────────────────────────
def resolve_product_id(raw_id: str) -> Optional[str]:
    if raw_id in PRODUCT_MAP:
        return raw_id
    if raw_id in SLUG_TO_ID:
        return SLUG_TO_ID[raw_id]
    return None

def _make_result(pid: str, score: float, reason: str):
    item = PRODUCT_MAP[pid].copy()
    item["score"]  = round(score, 3)
    item["reason"] = reason
    return item

# ── Recommendation strategies ─────────────────────────────────────────────────
def get_popular_recommendations(n: int = 6):
    scores = {}
    for row in RAW_INTERACTIONS:
        scores[row["product"]] = scores.get(row["product"], 0) + row["score"]
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:n]
    return [_make_result(pid, sc, "Trending on 57 Arts") for pid, sc in ranked if pid in PRODUCT_MAP]

def get_user_recommendations(user_id: str, n: int = 6):
    matrix = build_matrix()
    if user_id not in matrix.index:
        return get_popular_recommendations(n)

    user_vector  = matrix.loc[user_id].values.reshape(1, -1)
    similarities = cosine_similarity(user_vector, matrix.values)[0]
    user_seen    = set(matrix.columns[matrix.loc[user_id] > 0])
    scores       = {}

    for i, other_user in enumerate(matrix.index):
        if other_user == user_id:
            continue
        sim = similarities[i]
        if sim <= 0:
            continue
        for product_id in matrix.columns:
            if product_id in user_seen:
                continue
            rating = matrix.loc[other_user, product_id]
            if rating > 0:
                scores[product_id] = scores.get(product_id, 0) + sim * rating

    ranked  = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:n]
    results = [_make_result(pid, sc, "Users like you also loved this") for pid, sc in ranked if pid in PRODUCT_MAP]
    return results if results else get_popular_recommendations(n)

def get_category_recommendations(category: str, n: int = 6):
    cat_ids = [p["id"] for p in PRODUCTS if p["category"].lower() == category.lower()]
    if not cat_ids:
        return []

    scores = {}
    for row in RAW_INTERACTIONS:
        if row["product"] in cat_ids:
            scores[row["product"]] = scores.get(row["product"], 0) + row["score"]

    scored_sorted = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    scored_ids    = [pid for pid, _ in scored_sorted]
    unscored_ids  = [pid for pid in cat_ids if pid not in scored_ids]
    ordered_ids   = (scored_ids + unscored_ids)[:n]
    return [_make_result(pid, scores.get(pid, 0), f"Top pick in {category}") for pid in ordered_ids]

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status":     "57 Arts AI Service running ✅",
        "endpoints":  ["/recommendations", "/interactions", "/similar/{id}", "/chat", "/products"],
        "products":   len(PRODUCTS),
        "categories": list(set(p["category"] for p in PRODUCTS)),
    }

@app.get("/recommendations")
def recommendations(
    user_id:  Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    n:        int            = Query(6, ge=1, le=12),
):
    if user_id:
        recs     = get_user_recommendations(user_id, n)
        strategy = "collaborative_filtering"
    elif category:
        recs     = get_category_recommendations(category, n)
        strategy = "content_based"
    else:
        recs     = get_popular_recommendations(n)
        strategy = "popularity_based"

    return {"strategy": strategy, "user_id": user_id, "category": category, "count": len(recs), "recommendations": recs}

@app.post("/interactions")
def record_interaction(payload: InteractionPayload):
    score_map = {"view": 1, "cart": 2, "purchase": 3}
    score     = score_map.get(payload.action, 1)

    pid = resolve_product_id(payload.product_id)
    if not pid:
        return {"status": "ignored", "reason": "product not found"}

    _live_interactions[(payload.user_id, pid)] = float(score)
    return {"status": "recorded", "user_id": payload.user_id, "product_id": pid, "action": payload.action, "score": score}

@app.get("/similar/{product_id}")
def similar_products(product_id: str, n: int = Query(4, ge=1, le=8)):
    pid = resolve_product_id(product_id)
    if not pid:
        return {"error": "Product not found", "similar": []}

    matrix = build_matrix()
    if pid not in matrix.columns:
        return {"error": "Product not in matrix", "similar": []}

    product_vector = matrix[pid].values.reshape(1, -1)
    similarities   = cosine_similarity(product_vector, matrix.values.T)[0]
    product_ids    = list(matrix.columns)

    scored = sorted(
        [(product_ids[i], float(sim)) for i, sim in enumerate(similarities) if product_ids[i] != pid],
        key=lambda x: x[1], reverse=True,
    )[:n]

    results = []
    for p, sim in scored:
        if p in PRODUCT_MAP:
            item = PRODUCT_MAP[p].copy()
            item["similarity"] = round(sim, 3)
            item["reason"]     = "Often bought together"
            results.append(item)

    return {"product_id": pid, "similar": results}

@app.post("/chat")
def chat(payload: ChatPayload):
    if not payload.message or not payload.message.strip():
        return {"response": "Please type a message so I can help you! 😊"}

    # Convert history models to plain dicts for processing
    history_dicts = [{"role": h.role, "content": h.content} for h in (payload.history or [])]
    response = get_chat_response(payload.message, history_dicts)

    return {"response": response, "user_id": payload.user_id}

@app.get("/products")
def list_products():
    return {
        "products": [
            {"id": p["id"], "name": p["name"], "slug": p["slug"], "category": p["category"], "price": p["price"]}
            for p in PRODUCTS
        ]
    }