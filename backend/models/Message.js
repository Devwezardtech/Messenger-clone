// server/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  seen: { type: Boolean, default: false },      // <-- new
  seenAt: { type: Date, default: null }         // <-- optional
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
