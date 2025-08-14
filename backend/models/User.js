const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }, // optional
  lastOnline: { type: Date, default: null},
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
