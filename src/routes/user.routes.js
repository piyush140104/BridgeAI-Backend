import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Configure rate limiter for logout route
const logoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many logout attempts from this IP, please try again later.",
});

// Rate limiter for the /register route
const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many accounts created from this IP, please try again after 15 minutes",
});

router.route("/register").post(registerRateLimiter, registerUser);

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(logoutRateLimiter, verifyJWT, logoutUser);

router.route("/refreshtoken").post(refreshAccessToken);

router.route("/changepassword").post(changeCurrentPassword);

export default router;