import { model, Schema } from "mongoose";
import type { User as UserType } from "../types/user.types.ts";

const userSchema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  specialization: {
    type: "String",
    enum: [
      "Software Engineer",
      "Data Scientist",
      "Business Analyst",
      "Designer",
      "Project Manager",
      "Front End Developer",
      "Back End Developer",
      "Full Stack Developer",
      "QA Engineer",
      "Dev-Ops Engineer",
    ],
  },
  skills: [{ type: "String", default: [] }],
  projects: [{ type: Schema.Types.ObjectId, ref: "Room", default: [] }],
  activities: [{ type: Schema.Types.ObjectId, ref: "Activity", default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
});

export const User = model("User", userSchema);
