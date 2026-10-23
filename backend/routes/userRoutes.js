
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

