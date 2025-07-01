import { model, Schema } from "mongoose";
import type { User as UserType } from "../types/user.types.ts";

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String, default: "" },
    avatar: {
      type: String,
      default:
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg",
    },
    specialization: {
      type: "String",
      enum: [
        "Software Engineer",
        "Data Scientist",
        "Business Analyst",
        "Designer",
        "Project Manager",
        "Front-End Developer",
        "Back-End Developer",
        "Full Stack Developer",
        "QA Engineer",
        "Dev-Ops Engineer",
        "Guest",
      ],
      default: "Guest",
    },
    skills: [{ type: "String", default: [] }],
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room", default: [] }],
    activities: [{ type: Schema.Types.ObjectId, ref: "Activity", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true },
);

export const User = model("User", userSchema);
