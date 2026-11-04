const express = require("express"); //express() creates our main backend application.
const router = express.Router(); //express.Router() creates a seprate group of routes.

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Rigteration route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  if (!email.includes("@")) {
    return res.status(400).json({
      message: "Please enter a valid email",
    });
  }
  if (password.length < 10) {
    return res.status(400).json({
      message: "Password must be 10 character long!",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Registration error", error);

    res.status(500).json({
      message: "Server error during the registration",
    });
  }
});

//Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and Password required",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid user or password",
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
});

module.exports = router;
