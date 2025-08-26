import express from "express";
import {
  login,
  logout,
  signup,
  onboard,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); // post method is used to change the server state

router.post("/onboarding", protectRoute, onboard);
// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
export default router;
