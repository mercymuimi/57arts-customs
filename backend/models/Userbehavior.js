const mongoose = require('mongoose');

// This model is the fuel for your AI recommendation engine.
// Every time a user views a product, searches, or clicks — we record it here.

const userBehaviorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // optional — guests tracked by sessionId
    },
    sessionId: { type: String, index: true },

    eventType: {
      type: String,
      enum: [
        'product_view',
        'product_click',
        'search',
        'add_to_cart',
        'remove_from_cart',
        'wishlist_add',
        'purchase',
        'category_browse',
        'chatbot_interaction',
      ],
      required: true,
    },

    // What they interacted with
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    category: { type: String },
    searchQuery: { type: String },

    // How long they stayed (ms) — useful for interest scoring
    dwellTime: { type: Number },

    // Device context
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
    referrer: { type: String }, // e.g. affiliate link, google, direct

    // Affiliate tracking
    affiliateCode: { type: String },

    timestamp: { type: Date, default: Date.now, index: true },
  },
  {
    // Don't use regular timestamps — we use our own timestamp field
    timestamps: false,
  }
);

// Compound index for fetching a user's recent behavior quickly
userBehaviorSchema.index({ user: 1, timestamp: -1 });
userBehaviorSchema.index({ sessionId: 1, timestamp: -1 });

// Auto-delete events older than 90 days to keep the collection lean
userBehaviorSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const UserBehavior = mongoose.model('UserBehavior', userBehaviorSchema);
module.exports = UserBehavior;