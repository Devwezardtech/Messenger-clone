const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get all users (protected) - returns only needed fields
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({}, "_id name avatar lastOnline"); // no password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single user
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "_id name avatar lastOnline");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
