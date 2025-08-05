/*import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });

      //const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ name, email, password: hashedPassword });
      res.status(201).json({ message: "User registered successfully" });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Login route
router.post("/login", async (req, res) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
         { userId: user._id, role: user.role },
         process.env.JWT_SECRET,
         { expiresIn: "1y" }
      );

      res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Protected Route
router.get("/me", (req, res) => {
   const token = req.headers.authorization?.split(" ")[1];
   if (!token) return res.status(401).json({ message: "Unauthorized" });

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ message: "Access granted", userId: decoded.userId });
   } catch {
      res.status(401).json({ message: "Invalid token" });
   }
});

export default router;
*/