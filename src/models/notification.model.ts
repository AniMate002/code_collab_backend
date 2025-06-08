import { model, Schema } from "mongoose";
import { Notification as NotificationType } from "../types/notification.types";

const notificationSchema = new Schema<NotificationType>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    required: true,
    enum: ["invitation", "request", "follow"],
  },
  isAccepted: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
});

export const Notification = model("Notification", notificationSchema);
