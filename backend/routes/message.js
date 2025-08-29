const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Send and save message
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.userId;
    if (!receiverId || !text) return res.status(400).json({ message: "Receiver and text required" });

    const message = await Message.create({ senderId, receiverId, text });

    // Populate sender and receiver info
    message = await message.populate("senderId", "name avatar")
    .populate("receiverId", "name avatar");

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get conversation between logged-in user and other user
router.get("/conversation/:otherUserId", auth, async (req, res) => {
  try {
    const user1 = req.user.userId;
    const user2 = req.params.otherUserId;

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 })
    .populate("senderId", "name avatar")
    .populate("receiverId", "name avatar");

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/seen/:otherUserId", auth, async (req, res) => {
  try {
    const me = req.user.userId;
    const other = req.params.otherUserId;

    const result = await Message.updateMany(
      { senderId: other, receiverId: me, seen: false },
      { $set: { seen: true, seenAt: new Date() } }
    );

    return res.json({ ok: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error marking messages seen", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/message/mark-seen/:userId
router.put("/mark-seen/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    await Message.updateMany(
      { senderId: userId, receiverId: req.user.userId, seen: false },
      { $set: { seen: true, seenAt: new Date() } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
