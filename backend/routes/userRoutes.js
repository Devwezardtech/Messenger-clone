const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

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

// Update profile (name, password, avatar)
router.put("/update/:id", async (req, res) => {
  console.log("PUT /update/:id reached with", req.params.id, req.body);
  try {
    const { name, password, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password"); // don’t return hashed password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

module.exports = router;
