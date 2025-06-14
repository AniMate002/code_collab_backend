import type { Request, Response } from "express";
import { Notification } from "../models/notification.model.ts";
import { Room } from "../models/room.model.ts";
import { Activity } from "../models/activity.model.ts";
import { ActivityTitleType } from "../types/activity.types.ts";
import { User } from "../models/user.model.ts";

export const getAllNotificationsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await Notification.find({ to: user._id });

    await Notification.updateMany({ to: user._id }, { isRead: true });
    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// INVITATION
export const sendInvitationController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { to, roomId } = req.body;
    if (!to || !roomId)
      return res.status(400).json({ message: "Missing properties" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const notification = new Notification({
      to,
      from: user._id,
      room: room._id,
      type: "invitation",
    });

    const activity = new Activity({
      title: ActivityTitleType.sendInvite,
      user: user._id,
      room: room._id,
    });

    await Promise.all([notification.save(), activity.save()]);
    return res.status(201).json(notification);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const acceptInvitationController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    const room = await Room.findById(notification.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const user = await User.findById(notification.to);
    if (!user) return res.status(404).json({ message: "User not found" });

    const activity = new Activity({
      title: ActivityTitleType.joinRoom,
      user: notification.to,
      room: room._id,
    });

    await Promise.all([
      room.updateOne({ $push: { contributors: notification.to } }),
      user.updateOne({ $push: { rooms: room._id } }),
      activity.save(),
      notification.updateOne({ isRead: true, isAccepted: true }),
    ]);
    return res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const rejectInvitationController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const notification = await Notification.findById(id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    const room = await Room.findById(notification.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const user = await User.findById(notification.to);
    if (!user) return res.status(404).json({ message: "User not found" });

    const activity = new Activity({
      title: ActivityTitleType.rejectInvite,
      user: notification.to,
      room: room._id,
    });

    await Promise.all([
      activity.save(),
      notification.updateOne({ isRead: true, isAccepted: false }),
    ]);
    return res.status(200).json({ message: "Invitation rejected" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// REQUEST

export const sendRequestController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ message: "Missing properties" });

    const user = req?.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const activity = new Activity({
      title: ActivityTitleType.requestRoom,
      user: user._id,
      room: room._id,
    });

    await activity.save();

    return res.status(201).json({ message: "Request sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const acceptRequestController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    const activity = await Activity.findById(id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    const room = await Room.findById(activity.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const user = await User.findById(activity.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = new Notification({
      to: user._id,
      from: req!.user!._id,
      room: room._id,
      type: "requestAccepted",
      isAccepted: true,
    });

    const newActivity = new Activity({
      title: ActivityTitleType.joinRoom,
      user: user._id,
      room: room._id,
    });

    await Promise.all([
      room.updateOne({ $push: { contributors: user._id } }),
      user.updateOne({ $push: { rooms: room._id } }),
      notification.save(),
      newActivity.save(),
    ]);
    return res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const rejectRequestController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    const activity = await Activity.findById(id);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    const room = await Room.findById(activity.room);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const user = await User.findById(activity.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newActivity = new Activity({
      title: ActivityTitleType.requestRejected,
      user: user._id,
      room: room._id,
    });

    const notification = new Notification({
      to: user._id,
      from: req!.user!._id,
      room: room._id,
      type: "requestRejected",
      isAccepted: false,
    });

    await Promise.all([notification.save(), newActivity.save()]);
    return res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
