import { model, Schema } from "mongoose";
import type { Notification as NotificationType } from "../types/notification.types.ts";

const notificationSchema = new Schema<NotificationType>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      required: true,
      enum: [
        "invitation",
        "requestAccepted",
        "requestRejected",
        "follow",
        "request",
      ],
    },
    room: { type: Schema.Types.ObjectId, ref: "Room", optional: true },
    isResolved: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = model("Notification", notificationSchema);
