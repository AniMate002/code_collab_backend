import type { Activity } from "./activity.types.ts";
import type { Room } from "./room.types.ts";

export type Specialization =
  | "Software Engineer"
  | "Data Scientist"
  | "Business Analyst"
  | "Designer"
  | "Project Manager"
  | "Front End Developer"
  | "Back End Developer"
  | "Full Stack Developer"
  | "QA Engineer"
  | "Dev-Ops Engineer"
  | "Guest";

export type User = {
  _id: string;
  name: string;
  email: string;
  about: string;
  password: string;
  avatar: string;
  specialization: Specialization;
  skills: string[];
  rooms: Array<Room>;
  activities: Array<Activity>;
  following: Array<User>;
  followers: Array<User>;
};
