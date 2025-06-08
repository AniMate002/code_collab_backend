import { User } from "./user.types";
import { Activity } from "./activity.types";

export type RoomType = "public" | "private";
export type TaskStatus = "not started" | "in progress" | "finished";

export type Message = {
  _id: string;
  sender: User;
  body: string;
  timestamp: {
    createdAt: Date;
    updatedAt: Date;
  };
};

export type Link = {
  _id: string;
  name: string;
  link: string;
};

export type File = {
  _id: string;
  name: string;
  link: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  assignedTo: User;
  deadline: Date;
  status: TaskStatus;
};

export type Room = {
  _id: string;
  title: string;
  description: string;
  contributors: Array<User>;
  activities: Array<Activity>;
  type: RoomType;
  messages: Array<Message>;
  links: Array<Link>;
  files: Array<File>;
  tasks: Array<Task>;
};
