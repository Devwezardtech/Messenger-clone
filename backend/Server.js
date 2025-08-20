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
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

// Updated CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://realtimechat-delta.vercel.app",
  process.env.CLIENT_ORIGIN
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// Health check route for Render
app.get("/", (req, res) => {
  res.json({ message: "Messenger Clone Backend is running!" });
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB Connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Socket.IO configuration
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins,
    credentials: true 
  },
});

// userId -> socketId map
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);

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
        console.log(`User ${disconnectedUserId} disconnected, updated lastOnline`);
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
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});