import type { User } from "./user.types.ts";
import type { Room } from "./room.types.ts";

export type NotificationType =
  | "invitation"
  | "request"
  | "requestAccepted"
  | "requestRejected"
  | "follow"
  | "invitationAccepted"
  | "invitationRejected";

export type Notification = {
  _id: string;
  body: string;
  from: User;
  to: User;
  room: Room;
  type: NotificationType;
  isRead: boolean;
  isResolved: boolean;
};
