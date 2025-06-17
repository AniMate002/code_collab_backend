import { Router } from "express";
import {
  getAllUsersController,
  getSingleUserByIdController,
  createUserController,
  updateUserController,
  filterUsersController,
  deleteUserController,
  followUnfollowUserController,
  getUserFollowersController,
} from "../controllers/user.controller.ts";
import { checkAuth } from "../middleware/auth.middleware.ts";

const router = Router();
// GET
router.get("/", getAllUsersController);
router.get("/filter", filterUsersController);
router.get("/:id", getSingleUserByIdController);
router.get("/:id/followers", getUserFollowersController);
// POST
router.post("/", createUserController);
// PUT
router.put("/:id", checkAuth, updateUserController);
// PATCH
router.patch("/:id/follow", checkAuth, followUnfollowUserController);
// DELETE
router.delete("/:id", checkAuth, deleteUserController);

export default router;
