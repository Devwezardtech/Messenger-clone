const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// POST: send a message
router.post("/usermessages/:id", async (req, res) => {
  try {
    const { message, senderId } = req.body;
    const receiverId = req.params.id;

     console.log("Received POST to send message:", { message, senderId, receiverId });

    if (!message || !senderId || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sentMessage = await Message.create({
      message,
      senderId,
      receiverId,
    });

    console.log("Message saved:", sentMessage);
    
    res.status(200).json(sentMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET: all messages between two users
router.get("/usermessages/:id", async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId;
    const otherUserId = req.params.id;

    if (!currentUserId || !otherUserId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
