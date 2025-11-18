// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // testing only: plain password
  password: { type: String, required: true },
  avatar: { type: String, default: this.name?.charAt(0).toUpperCase() }, // optional,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
