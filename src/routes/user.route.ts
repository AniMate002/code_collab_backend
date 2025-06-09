import { Router } from "express";
import {
  getAllUsersController,
  getSingleUserByIdController,
  createUserController,
  updateUserController,
  filterUsersController,
  deleteUserController,
  followUnfollowUserController,
} from "../controllers/user.controller.ts";

const router = Router();
// GET
router.get("/", getAllUsersController);
router.get("/filter", filterUsersController);
router.get("/:id", getSingleUserByIdController);
// POST
router.post("/", createUserController);
// PUT
router.put("/:id", updateUserController);
router.put("/follow", followUnfollowUserController);
// DELETE
router.delete("/:id", deleteUserController);

export default router;
