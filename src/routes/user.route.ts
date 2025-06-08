import { Router } from "express";
import {
  getAllUsersController,
  getSingleUserByIdController,
  createUserController,
  updateUserController,
} from "../controllers/user.controller.ts";

const router = Router();

router.get("/", getAllUsersController);
router.get("/:id", getSingleUserByIdController);
// FILTER BY SPECIALIZAYION
// router.get("/filter", filterUsersController);

router.post("/", createUserController);

router.put("/:id", updateUserController);

// FOLLOW / UNFOLLOW
// router.put("/follow", followUnfollowUserController);

export default router;
