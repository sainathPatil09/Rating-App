
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Signup (only for normal users directly)
export const signup = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    console.log(name, email, password, address, role);

    // password validation
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ msg: "Password must be 8-16 chars, include 1 uppercase & 1 special char" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPass, address, role });
    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Login (for all roles)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)  

    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
