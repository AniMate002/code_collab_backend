import { Router } from "express";
import {
  signUpAuthController,
  getMeAuthController,
  loginAuthController,
  logoutAuthController,
} from "../controllers/auth.controller.ts";
import { checkAuth } from "../middleware/auth.middleware.ts";

const router = Router();

router.post("/signup", signUpAuthController);
router.post("/login", loginAuthController);
router.get("/getMe", checkAuth, getMeAuthController);
router.post("/logout", logoutAuthController);

export default router;
