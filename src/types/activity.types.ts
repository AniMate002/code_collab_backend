import type { User } from "./user.types.ts";
import type { Room } from "./room.types.ts";

export const ActivityTitleType = {
  createFile: "Created file",
  createLink: "Created link",
  createRoom: "Created room",
  deleteLink: "Deleted link",
  sendInvite: "Sent invite",
  acceptInvite: "Accepted invite",
  rejectInvite: "Rejected invite",
  leaveRoom: "Left room",
  joinRoom: "Joined room",
  createTask: "Created task",
  updateTaskStatus: "Updated task status",
  requestRoom: "Requested access to this room",
  requestRejected: "Request rejected",
} as const;

export type ActivityTitleType = keyof typeof ActivityTitleType;

export type Activity = {
  title: ActivityTitleType;
  user: User;
  room: Room;
};
