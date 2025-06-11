import type { Request, Response } from "express";
import { Room } from "../models/room.model.ts";
import type { Message } from "../types/room.types.ts";

export const createRoomController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { title, description, image, topic, type } = req.body;
    if (!title || !description || !topic || !type)
      return res.status(400).json({ message: "Missing properties" });

    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const foundRoom = await Room.findOne({ title });
    if (foundRoom)
      return res
        .status(400)
        .json({ message: "Room with this name already exists" });

    const room = new Room({
      title,
      description,
      image,
      topic,
      type,
      contributors: [user._id],
    });
    await room.save();
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
    const rooms = await Room.find();
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

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
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

    const room = await Room.findById(id).select("messages");
    if (!room) return res.status(404).json({ message: "Room not found" });

    return res.status(200).json(room.messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
