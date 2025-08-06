const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const User = require("../models/User")
const router = express.Router();

router.post("/", async (req, res) => {
   try {
      const { name, password } = req.body;
      if (!name || !password) {
         return res.status(400).json({ error: "Name and password are required" });
      }

      const existingUser = await User.findOne({ name });
      if (existingUser) {
         return res.status(400).json({ error: "User alrady exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({ name, password: hashedPassword });
      res.status(201).json({ message: "User reqestered sucessfully", user: newUser });
   }
   catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal server error" });
   }
})

router.post("/login", async(req, res) => {
   try {
      const { name, password } = req.body;

      if(!name || !password) {
         return res.status(400).json({ message: "please fill out"})
      }

      const user = await User.findOne({ name });
      if (!user) {
         return res.status(400).json({ message: "Account does not exist"})
      }

      const isMatch = password.compare({password, password: hashedPassword})
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid Credintial"})
      }

      const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
         expiresIn: "7d",
      })

      res.status(200).json({
         message: "Login Successful", token, user: { id: user._id, name: user.name,
         },
      });
      
   }
   catch (error) {
      console.error("Login error", error);
      return res.status(500).json({ message: "enternal issue", error});
   }
})

module.exports = router;