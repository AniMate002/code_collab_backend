import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.ts";
import {
  createRoomController,
  getAllRoomsController,
  getSingleRoomByIdController,
  deleteRoomController,
  sendMessageController,
  getMessagesByRoomIdController,
  createLinkController,
  getLinksByRoomIdController,
  deleteLinkController,
  getActivitiesByRoomIdController,
  createTaskController,
  getTasksByRoomIdController,
  updateTaskStatusController,
  getContributorsByRoomIdController,
  joinLeaveRoomController,
  getFilteredRoomsController,
  getRecentRoomsController,
  uploadFileController,
  getFilesByRoomIdController,
  getRoomsBuQueryController,
} from "../controllers/room.controller.ts";

const router = Router();

router.get("/", getAllRoomsController);
router.get("/recent", getRecentRoomsController);
router.get("/filter", getFilteredRoomsController);
router.get("/search", getRoomsBuQueryController);

router.get("/:id", getSingleRoomByIdController);

// get
router.get("/:id/message", getMessagesByRoomIdController);
router.get("/:id/file", getFilesByRoomIdController);
router.get("/:id/link", getLinksByRoomIdController);
router.get("/:id/activity", getActivitiesByRoomIdController);
router.get("/:id/task", getTasksByRoomIdController);
router.get("/:id/contributor", getContributorsByRoomIdController);

// post
router.post("/", checkAuth, createRoomController);
router.post("/:id/message", checkAuth, sendMessageController);
router.post("/:id/file", checkAuth, uploadFileController);
router.post("/:id/link", checkAuth, createLinkController);
router.post("/:id/task", checkAuth, createTaskController);
router.post("/:id/join", checkAuth, joinLeaveRoomController);

// delete
router.delete("/:id", checkAuth, deleteRoomController);
router.delete("/:id/link", checkAuth, deleteLinkController);

// patch
router.patch("/:id/task", checkAuth, updateTaskStatusController);

export default router;
