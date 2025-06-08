import { Activity } from "./activity.types";
import { Room } from "./room.types";

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
  | "Dev-Ops Engineer";

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  specialization: Specialization;
  skills: string[];
  projects: Array<Room>;
  activities: Array<Activity>;
  following: Array<User>;
  followers: Array<User>;
};
