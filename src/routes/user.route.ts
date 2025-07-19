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
  getUserFollowingController,
  getUserRoomsController,
  getUserActivityController,
  getFeaturedUsersController,
  searchUsersByQueryController,
} from "../controllers/user.controller.ts";
import { checkAuth } from "../middleware/auth.middleware.ts";

const router = Router();
// GET
router.get("/", getAllUsersController);
router.get("/filter", filterUsersController);
router.get("/search", searchUsersByQueryController);
router.get("/featured", getFeaturedUsersController);
router.get("/:id", getSingleUserByIdController);
router.get("/:id/followers", getUserFollowersController);
router.get("/:id/following", getUserFollowingController);
router.get("/:id/rooms", getUserRoomsController);
router.get("/:id/activity", getUserActivityController);
// POST
router.post("/", createUserController);
// PUT
router.put("/:id", checkAuth, updateUserController);
// PATCH
router.patch("/:id/follow", checkAuth, followUnfollowUserController);
// DELETE
router.delete("/:id", checkAuth, deleteUserController);

export default router;
