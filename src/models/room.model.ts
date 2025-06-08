import { model, Schema } from "mongoose";
import type { Room as RoomType } from "../types/room.types.ts";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
);

const linkSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const fileSchema = new Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["not started", "in progress", "finished"],
    default: "not started",
  },
});

const roomSchema = new Schema<RoomType>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  contributors: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  activities: [{ type: Schema.Types.ObjectId, ref: "Activity", default: [] }],
  type: { type: String, default: "public", enum: ["public", "private"] },
  messages: [{ type: messageSchema, default: [] }],
  links: { type: [linkSchema], default: [] },
  files: { type: [fileSchema], default: [] },
  tasks: { type: [taskSchema], default: [] },
});

export const Room = model("Room", roomSchema);
