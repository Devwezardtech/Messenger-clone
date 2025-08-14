require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const  messageRoutes = require("./routes/message");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());


// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB error", err));

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", 
    credentials: true
   }
});

// keep map of userId -> socketId
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    // console.log("online users:", onlineUsers);
  });

  socket.on("directMessage", async ({ senderId, receiverId, text }) => {
    // Save message to DB
    try {
      const saved = await Message.create({ senderId, receiverId, text });
      // emit to receiver if online
      const receiverSocketId = onlineUsers[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", saved);
      }
      // also emit back to sender socket for immediate UI update if needed
      socket.emit("messageSaved", saved);
    } catch (err) {
      console.error("Error saving direct message", err);
    }
  });

// When user starts typing
socket.on("typing", ({ senderId, receiverId }) => {
  const receiverSocketId = onlineUsers[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("typing", { senderId });
  }
});

// When user stops typing
socket.on("stopTyping", ({ senderId, receiverId }) => {
  const receiverSocketId = onlineUsers[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("stopTyping", { senderId });
  }
});



  socket.on("disconnect", () => {
    // remove user from onlineUsers
    for (const [userId, sId] of Object.entries(onlineUsers)) {
      if (sId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
