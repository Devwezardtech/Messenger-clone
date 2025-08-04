const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req, res) => {
   try {
      const { name, password } = req.body;
      if (!name || !password) {
         return res.status(400).json({ error: "Name is required" });
      }
      const newUser = new User({ name, password });
      const saved = await newUser.save();
      res.status(201).json(saved);
   }
   catch (error) {
      console.error("error saving name:", error);
      res.status(500).json({ error: "Internal server error" });
   }
})

router.get("/", async (req, res) => {
   try {
      const users = await User.find();
      res.status(200).json(users);
   }
   catch (error) {
      console.error("error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });   
   }
})

router.put("/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const {name, password} = req.body;

      if (!name || !password) {
         return res.status(400).json({ error: "Name and password are required" });
      }

      const updatedUser = await User.findByIdAndUpdate(
         id, 
         { name, password },
         { new: true }


      )
      if (!updatedUser) {
         return res.status(404).json({ error: "User not found" });
      }
   }
   catch (error) {
      console.error("error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
   }     
})

module.exports = router;