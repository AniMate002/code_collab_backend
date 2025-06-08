import { model, Schema } from "mongoose";
import type { Activity as ActivityType } from "../types/activity.types.ts";

const activitySchema = new Schema<ActivityType>(
  {
    title: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Activity = model("Activity", activitySchema);
