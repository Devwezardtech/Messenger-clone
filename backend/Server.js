require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/message");
const Message = require("./models/Message");
const User = require("./models/User"); // IMPORTANT: import User model

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: true },
});

// userId -> socketId map
const onlineUsers = {};

io.on("connection", (socket) => {
  //console.log("socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;

    // Emit a simplified map: userId -> true
    const statusMap = {};
    for (const id of Object.keys(onlineUsers)) {
      statusMap[id] = true;
    }
    io.emit("onlineUsers", statusMap);
  });

  socket.on("directMessage", async ({ senderId, receiverId, text }) => {
    try {
      const saved = await Message.create({ senderId, receiverId, text });

      // emit to receiver if online
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", saved);
      }

      // also emit back to sender socket
      socket.emit("messageSaved", saved);
    } catch (err) {
      console.error("Error saving direct message", err);
    }
  });

  // Typing indicators
  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId });
    }
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId });
    }
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    let disconnectedUserId = null;

    for (const [userId, sId] of Object.entries(onlineUsers)) {
      if (sId === socket.id) {
        disconnectedUserId = userId;
        delete onlineUsers[userId];
        break;
      }
    }

    // Update lastOnline timestamp in DB
    if (disconnectedUserId) {
      try {
        await User.findByIdAndUpdate(disconnectedUserId, { lastOnline: new Date() });
      } catch (err) {
        console.error("Error updating lastOnline:", err);
      }
    }

    // Emit updated online status
    const statusMap = {};
    for (const id of Object.keys(onlineUsers)) {
      statusMap[id] = true;
    }
    io.emit("onlineUsers", statusMap);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
