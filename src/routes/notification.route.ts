import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware.ts";
import {
  getAllNotificationsController,
  sendInvitationController,
  acceptInvitationController,
  sendRequestController,
  acceptRequestController,
  rejectInvitationController,
  rejectRequestController,
} from "../controllers/notification.controller.ts";

const router = Router();

// GET
router.get("/", checkAuth, getAllNotificationsController);

// POST
router.post("/sendInvitation", checkAuth, sendInvitationController);
router.post("/sendRequest", checkAuth, sendRequestController);

// PUT
router.put("/:id/acceptInvitation", checkAuth, acceptInvitationController);
router.put("/:id/acceptRequest", checkAuth, acceptRequestController);
router.put("/:id/rejectInvitation", checkAuth, rejectInvitationController);
router.put("/:id/rejectRequest", checkAuth, rejectRequestController);

export default router;
