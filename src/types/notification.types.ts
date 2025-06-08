import { User } from "./user.types";

export type NotificationType = "invitation" | "request" | "follow";

export type Notification = {
  _id: string;
  title: string;
  body: string;
  user: User;
  type: NotificationType;
  isAccepted: boolean;
  isRead: boolean;
};
