import { User } from "./user.types";

export type Activity = {
  _id: string;
  title: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
