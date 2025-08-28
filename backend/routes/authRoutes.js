const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/multer");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, password, avatar} = req.body;
    if (!name || !password || !avatar) return res.status(400).json({ message: "Name, password and photo is required" });

    const exists = await User.findOne({ name });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, password: hashed, avatar });
    return res.status(201).json({ id: user._id, name: user.name, avatar: user.avatar });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      success: true,
      url: req.file.path, // Cloudinary image URL
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ message: "Name and password required" });

    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id.toString(), name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user._id, name: user.name, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
