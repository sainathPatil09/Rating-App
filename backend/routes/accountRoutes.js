// routes/accountRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import { protect } from "../middleware/authMiddleware.js";
import { User } from "../models/user.model.js";

const router = express.Router();

router.put("/password", protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword, newPassword);

    // policy: 8–16, 1 uppercase, 1 special
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passRegex.test(newPassword)) {
      return res.status(400).json({ msg: "Password must be 8–16 with 1 uppercase & 1 special char" });
    }

    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ msg: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ msg: "Password updated" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update profile (name/email only, not password)
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;
