import { model, Schema } from "mongoose";
import { Room as RoomType } from "../types/room.types";

const messageSchema = new Schema(
  {
    _id: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
);

const linkSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const fileSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const taskSchema = new Schema({
  _id: { type: String, required: true },
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
  _id: { type: String, required: true },
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
