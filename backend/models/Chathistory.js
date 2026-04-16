const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },

  // Optional: track what the AI suggested
  suggestedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // not required — guest users can also chat
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    messages: [messageSchema],

    // Context for the AI (what category/page user was on)
    context: {
      page: { type: String },       // e.g. 'fashion', 'furniture', 'beads'
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    },

    // AI feedback — useful for improving the model
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },

    isActive: { type: Boolean, default: true },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

// Virtual: message count
chatHistorySchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

// Auto-close sessions older than 2 hours with no activity
chatHistorySchema.index({ updatedAt: 1 }, { expireAfterSeconds: 7200 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
module.exports = ChatHistory;