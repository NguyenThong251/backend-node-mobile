import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ msg: "Username must be at least 3 characters long" });
    }
    const exitingEmail = await User.findOne({ email });
    if (exitingEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const exitingUsername = await User.findOne({ username });
    if (exitingUsername) {
      return res.status(400).json({ msg: "Username already exists" });
    }
    const profileImages = `https://api.dicebear.com/9.x/${username}/svg`;
    const user = new User({ email, username, password, profileImages });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      _id: user._id,
      username: user.username,
      profileImages: user.profileImages,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      _id: user._id,
      username: user.username,
      profileImages: user.profileImages,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
