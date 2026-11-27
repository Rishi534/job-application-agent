
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userRegistrationRouter = express.Router();

userRegistrationRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, skills, preferredRole, preferredLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name and email and password are required"
      });
    }
    if(password.length < 8){
      return res.status(400).json({
        message: "Password must be at least 8 characters long"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    const newJobAgentUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      skills: Array.isArray(skills) ? skills : [],
      preferredRole: preferredRole || "",
      preferredLocation: preferredLocation || ""
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newJobAgentUser._id,
        name: newJobAgentUser.name,
        email: newJobAgentUser.email
      }
    });
  } catch (registrationError) {
    if (registrationError instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Please provide valid user details"
      });
    }

    console.error("Registration failed:", registrationError.message);

    res.status(500).json({
      message: "Unable to register user"
    });
  }
});

const verifyUserToken = require("../middleware/authMiddleware");

// Get logged-in user's profile & skills
userRegistrationRouter.get("/profile", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch user profile" });
  }
});

// Update logged-in user's skills & job preferences
userRegistrationRouter.put("/profile", verifyUserToken, async (req, res) => {
  try {
    const { skills, preferredRole, preferredLocation } = req.body || {};
    const updates = {};

    if (Array.isArray(skills)) {
      updates.skills = skills.map((s) => s.trim()).filter(Boolean);
    }
    if (typeof preferredRole === "string") {
      updates.preferredRole = preferredRole.trim();
    }
    if (typeof preferredLocation === "string") {
      updates.preferredLocation = preferredLocation.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Updating profile failed:", error.message);
    return res.status(500).json({ message: "Unable to update profile" });
  }
});

module.exports = userRegistrationRouter;


userRegistrationRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    }).select("+passwordHash");

    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const loginToken = require("jsonwebtoken").sign(
      { userId: existingUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: loginToken,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      }
    });
  } catch (loginError) {
    console.error("Login failed:", loginError.message);

    return res.status(500).json({
      message: "Unable to log in"
    });
  }
});

