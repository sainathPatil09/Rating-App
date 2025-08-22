import express from "express";
import { signup, login } from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signup); // only normal users use this
router.post("/login", login);   // all roles use this

export default router;
