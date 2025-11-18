// server/models/Chat.js
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, enum: ['dm','group'], default: 'dm' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
