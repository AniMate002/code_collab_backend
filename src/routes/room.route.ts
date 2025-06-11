import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.ts";
import {
  createRoomController,
  getAllRoomsController,
  getSingleRoomByIdController,
  deleteRoomController,
  sendMessageController,
  getMessagesByRoomIdController,
} from "../controllers/room.controller.ts";

const router = Router();

router.get("/", getAllRoomsController);
router.get("/:id", getSingleRoomByIdController);

// tabs get
router.get("/:id/message", getMessagesByRoomIdController);
// router.get("/:id/files", getFilesByRoomIdController);
// router.get("/:id/links", getLinksByRoomIdController);
// router.get("/:id/activities", getActivitiesByRoomIdController);
// router.get("/:id/contributors", getContributorsByRoomIdController);
// router.get("/:id/tasks", getTasksByRoomIdController);
// router.get("/filter", getFilteredRoomsController)

// post
router.post("/", checkAuth, createRoomController);
router.post("/:id/message", checkAuth, sendMessageController);
// router.post("/:id/file", checkAuth, uploadFileController);
// router.post("/:id/link", checkAuth, createLinkController);
// router.post("/:id/activity", checkAuth, createActivityController);
// router.post("/:id/task", checkAuth, createTaskController);
// router.post("/:id/contributor", checkAuth, addContributorController);
// router.post("/:id/join", checkAuth, joinLeaveRoomController);

// delete
router.delete("/:id", checkAuth, deleteRoomController);

export default router;
