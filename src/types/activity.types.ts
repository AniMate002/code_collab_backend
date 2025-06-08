import type { User } from "./user.types.ts";

export type Activity = {
  _id: string;
  title: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
