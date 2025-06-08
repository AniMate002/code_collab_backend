import { model, Schema } from "mongoose";
import { Activity as ActivityType } from "../types/activity.types";

const activitySchema = new Schema<ActivityType>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Activity = model("Activity", activitySchema);
