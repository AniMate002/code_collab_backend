import { model, Schema } from "mongoose";
import type { Notification as NotificationType } from "../types/notification.types.ts";

const notificationSchema = new Schema<NotificationType>({
  from: { type: Schema.Types.ObjectId, ref: "User" },
  to: { type: Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    required: true,
    enum: ["invitation", "requestAccepted", "requestRejected", "follow"],
  },
  room: { type: Schema.Types.ObjectId, ref: "Room" },
  isAccepted: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
});

export const Notification = model("Notification", notificationSchema);
