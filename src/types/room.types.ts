import type { User } from "./user.types.ts";

export type RoomType = "public" | "private";
export type TaskStatus = "not started" | "in progress" | "finished";

export type Message = {
  sender: User;
  body: string;
};

export type Link = {
  name: string;
  link: string;
};

export type File = {
  sender: User;
  link: string;
};

export type Task = {
  _id?: string;
  title: string;
  description: string;
  assignedTo: User;
  deadline: Date;
  status?: TaskStatus;
};

export type Room = {
  title: string;
  description: string;
  image: string;
  topic: string;
  admin: User;
  contributors: Array<User>;
  type: RoomType;
  messages: Array<Message>;
  links: Array<Link>;
  files: Array<File>;
  tasks: Array<Task>;
};
