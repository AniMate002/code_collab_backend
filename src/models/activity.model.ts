import { model, Schema } from "mongoose";
import {
  type Activity as ActivityType,
  ActivityTitleType,
} from "../types/activity.types.ts";

const activitySchema = new Schema<ActivityType>(
  {
    title: {
      type: String,
      required: true,
      enum: Object.values(ActivityTitleType),
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  },
  { timestamps: true },
);

export const Activity = model("Activity", activitySchema);
