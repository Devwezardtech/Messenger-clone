const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const  messageRoutes = require("./routes/message");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/user", userRoutes);
app.use("/api", authRoutes);
app.use("/api/message", messageRoutes);


// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log("MongoDB connected");

  } 
  catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Connect to database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
