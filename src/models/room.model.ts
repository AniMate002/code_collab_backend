import { model, Schema } from "mongoose";
import type {
  Link,
  Message,
  File,
  Task,
  Room as RoomType,
} from "../types/room.types.ts";

const messageSchema = new Schema<Message>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
  },
  { timestamps: true },
);

const linkSchema = new Schema<Link>({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const fileSchema = new Schema<File>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  link: { type: String, required: true },
});

const taskSchema = new Schema<Task>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ["not started", "in progress", "finished"],
    default: "not started",
  },
});

const roomSchema = new Schema<RoomType>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg",
    },
    topic: {
      type: String,
      default: "General",
      enum: [
        "Design",
        "Technology",
        "Gaming",
        "Education",
        "IT",
        "General",
        "Business",
      ],
    },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contributors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: { type: String, default: "public", enum: ["public", "private"] },
    messages: [{ type: messageSchema, default: [] }],
    links: { type: [linkSchema], default: [] },
    files: { type: [fileSchema], default: [] },
    tasks: { type: [taskSchema], default: [] },
  },
  { timestamps: true },
);

roomSchema.index({ title: "text", description: "text", topic: "text" });

export const Room = model("Room", roomSchema);
