const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/auth");
const router = express.Router();


// POST: send a message (secure)
router.post("/:receiverId", auth, async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;

    if (!receiverId || !message) {
      return res.status(400).json({ message: "Receiver ID and message are required" });
    }

    const newMessage = await Message.create({
      senderId: req.user.userId, // from token
      receiverId,
      message
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: messages between logged-in user and another user (secure)
router.get("/:otherUserId", auth, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
