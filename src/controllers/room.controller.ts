import type { Request, Response } from "express";
import { Room } from "../models/room.model.ts";
import type { Link, Message, Task } from "../types/room.types.ts";
import { ActivityTitleType } from "../types/activity.types.ts";
import { Activity } from "../models/activity.model.ts";
import { User } from "../models/user.model.ts";
import { v2 as cloudinary } from "cloudinary";

// ROOMS

export const createRoomController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { title, description, topic, type } = req.body;
    let { image } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: "Missing properties" });

    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const me = await User.findById(user._id);
    if (!me) return res.status(404).json({ message: "User not found" });

    const foundRoom = await Room.findOne({ title });
    if (foundRoom)
      return res
        .status(400)
        .json({ message: "Room with this name already exists" });

    if (image) {
      const res = await cloudinary.uploader.upload(image, {
        folder: "rooms",
        width: 1200,
        // height: 1200,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      });
      image = res.secure_url;
    }

    const room = new Room({
      title,
      description,
      image,
      topic,
      type,
      contributors: [user._id],
      admin: user._id,
    });

    const activity = new Activity({
      title: ActivityTitleType.createRoom,
      user: user._id,
      room: room._id,
    });

    await Promise.all([
      room.save(),
      activity.save(),
      user.updateOne({ $push: { rooms: room._id } }),
    ]);
    res.status(201).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getAllRoomsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const rooms = await Room.find().select([
      "_id",
      "title",
      "description",
      "image",
      "topic",
      "type",
    ]);
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getSingleRoomByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id)
      .select([
        "_id",
        "title",
        "description",
        "image",
        "topic",
        "type",
        "contributors",
      ])
      .populate({ path: "admin", select: "name avatar _id" });
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getRoomsBuQueryController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Missing query" });
    const rooms = await Room.find(
      { $text: { $search: query.toString() } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .select(["_id", "title", "description", "image", "topic", "type"]);
    return res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getFilteredRoomsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { topic } = req.query;
    const query = topic ? { topic } : {};
    const rooms = await Room.find(query).select([
      "_id",
      "title",
      "description",
      "image",
      "topic",
      "type",
    ]);

    return res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteRoomController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    await Room.findByIdAndDelete(id);

    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// MESSAGES
export const sendMessageController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { body } = req.body;
    if (!body) return res.status(400).json({ message: "Missing message body" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const message: Message = {
      body,
      sender: user._id,
    };

    await room.updateOne({ $push: { messages: message } });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getMessagesByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id).select("messages").populate({
      path: "messages.sender",
      select: "name avatar _id",
    });
    if (!room) return res.status(404).json({ message: "Room not found" });

    return res.status(200).json(room.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// LINKS
export const createLinkController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, link } = req.body;
    const { id } = req.params;
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!name || !link)
      return res.status(400).json({ message: "Missing properties" });

    if (!id) return res.status(400).json({ message: "Invalid id" });

    if (!link.startsWith("https://"))
      return res.status(400).json({ message: "Invalid link format" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const linkObject: Link = { name, link };

    const activity = new Activity({
      title: ActivityTitleType.createLink,
      user: user._id,
      room: room._id,
    });

    await Promise.all([
      room.updateOne({ $push: { links: linkObject } }),
      activity.save(),
    ]);
    res.status(201).json(linkObject);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getLinksByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const room = await Room.findById(id).select("links");
    if (!room) return res.status(404).json({ message: "Room not found" });
    return res.status(200).json(room.links);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteLinkController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const { linkId } = req.body;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const activity = new Activity({
      title: ActivityTitleType.deleteLink,
      user: user._id,
      room: room._id,
    });

    await Promise.all([
      room.updateOne({ $pull: { links: { _id: linkId } } }),
      activity.save(),
    ]);
    res.status(200).json({ message: "Link deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//ACTIVITIES

export const getActivitiesByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    const activities = await Activity.find({ room: id }).populate({
      path: "user",
      select: "name avatar _id",
    });
    return res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//TASKS
export const createTaskController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { title, description, assignedTo, deadline } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const assignedToUser = await User.findById(assignedTo);
    if (!assignedToUser)
      return res.status(404).json({ message: "Assignee not found" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const activity = new Activity({
      title: ActivityTitleType.createTask,
      user: user._id,
      room: room._id,
    });

    const task: Task = {
      title,
      description,
      assignedTo,
      deadline,
    };

    await Promise.all([
      room.updateOne({ $push: { tasks: task } }),
      activity.save(),
    ]);
    return res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getTasksByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id)
      .select("tasks")
      .populate({ path: "tasks.assignedTo", select: "name avatar _id" });
    if (!room) return res.status(404).json({ message: "Room not found" });

    return res.status(200).json(room.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateTaskStatusController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const { taskId, status } = req.body;
    if (!taskId || !status)
      return res.status(400).json({ message: "Missing properties" });

    const task = room.tasks.find(
      (task) => (task._id || "").toString() === taskId.toString(),
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    const activity = new Activity({
      title: ActivityTitleType.updateTaskStatus,
      user: user._id,
      room: room._id,
    });

    task.status = status;
    room.markModified("tasks");

    await Promise.all([room.save(), activity.save()]);
    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// CONTRIBUTORS
export const getContributorsByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id)
      .select("contributors")
      .populate("contributors");

    if (!room) return res.status(404).json({ message: "Room not found" });

    return res.status(200).json(room.contributors);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const joinLeaveRoomController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    if (!req?.user) return res.status(401).json({ message: "Unauthorized" });
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const room = await Room.findById(id).select("contributors");

    if (!room) return res.status(404).json({ message: "Room not found" });

    const joined = !room.contributors.includes(userId.toString());
    const activity = new Activity({
      title: joined ? ActivityTitleType.joinRoom : ActivityTitleType.leaveRoom,
      user: user._id,
      room: room._id,
    });

    await Promise.all([
      room.updateOne({
        [joined ? "$push" : "$pull"]: { contributors: userId },
      }),
      user.updateOne({ [joined ? "$push" : "$pull"]: { rooms: id } }),
      user.updateOne({ $push: { activities: activity._id } }),
      activity.save(),
    ]);

    const updatedRoom = await Room.findById(id).select("contributors");
    return res.status(200).json(updatedRoom?.contributors);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getRecentRoomsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const rooms = await Room.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select(["_id", "title", "description", "image", "topic", "type"]);
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const uploadFileController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!req?.user) return res.status(401).json({ message: "Unauthorized" });
    let { file } = req.body;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    if (!file) return res.status(400).json({ message: "No file provided" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const fileRes = await cloudinary.uploader.upload(file, {
      folder: "files",
      width: 1200,
      crop: "limit",
      quality: "auto",
      fetch_format: "auto",
    });
    file = fileRes.secure_url;

    // TODO: Create room activity for uploading file

    await room.updateOne({
      $push: { files: { sender: req.user._id, link: file } },
    });
    res.status(200).json(file);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getFilesByRoomIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const room = await Room.findById(id).select("files").populate({
      path: "files.sender",
      select: "name avatar _id",
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    return res.status(200).json(room.files);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
