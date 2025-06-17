import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import { Notification } from "../models/notification.model.ts";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getSingleUserByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const user = await User.findById(req.params.id).populate("rooms");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, email, specialization } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    user.specialization = specialization || user.specialization;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const filterUsersController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { specialization } = req.query;
    const users = await User.find({ specialization });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const followUnfollowUserController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const authUser = req.user;
    const { id } = req.params;
    if (!authUser) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.followers.some(
        (user) => user._id.toString() === authUser._id.toString(),
      )
    ) {
      await Promise.all([
        user.updateOne({ $pull: { followers: authUser._id } }),
        User.findByIdAndUpdate(authUser._id, {
          $pull: { following: user._id },
        }),
      ]);
      res.status(200).json({ message: "User unfollowed" });
    } else {
      const notification = new Notification({
        to: user._id,
        from: authUser._id,
        room: null,
        type: "follow",
        isAccepted: false,
        isRead: false,
      });
      await Promise.all([
        user.updateOne({ $push: { followers: authUser._id } }),
        User.findByIdAndUpdate(authUser._id, {
          $push: { following: user._id },
        }),
        notification.save(),
      ]);
      res.status(200).json({ message: "User followed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserFollowersController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const user = await User.findById(id)
      .select("followers")
      .populate("followers");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.followers);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
