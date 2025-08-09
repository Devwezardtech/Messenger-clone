const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const User = require("../models/User");
const { config } = require("dotenv");
const router = express.Router(); 


//register
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

//login
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

      const isMatch = await bcrypt.compare(password, user.password)
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

//validate with auth
router.get("/me", async (req, res ) => {
   try{
      const authHeader = req.header.authorization;

      if (!authHeader || !authHeader ) {
         return res.status(400).json({ message: "no token found"});
      }

      const token = authHeader.split(" ")[1];
      const decoded = token.verify( token, process.eventNames.JWT_SECRET )

      res.status(200).json({
         message: "authorized", 
         user: {
            id: decoded.userId,
            name: decoded.name
         }
      })

   }
   catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
   }
})


module.exports = router;