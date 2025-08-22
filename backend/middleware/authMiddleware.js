
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Protect routes (verify token)
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token", token)
    //   console.log("Decoding...")
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //   console.log("Decoded ",decoded)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ msg: "Token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
};

// Restrict access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "You do not have permission to perform this action" });
    }
    next();
  };
};
