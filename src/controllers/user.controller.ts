import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import { Notification } from "../models/notification.model.ts";
import { v2 as cloudinary } from "cloudinary";
import { Activity } from "../models/activity.model.ts";

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
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const searchUsersByQueryController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Missing query" });
    const users = await User.find(
      { $text: { $search: query.toString() } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" } })
      .select("_id name avatar specialization");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const email = req.body?.email;
    if (!email) return res.status(400).json({ message: "Missing email" });
    const userWithThisEmail = await User.findOne({ email });
    if (userWithThisEmail)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
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
    const { name, email, specialization, about, skills } = req.body;
    let { avatar } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email !== user.email) {
      const userWithThisEmail = await User.findOne({ email });
      if (userWithThisEmail)
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.specialization = specialization || user.specialization;
    user.skills = skills || user.skills;
    user.about = about || user.about;

    if (avatar && avatar !== user.avatar) {
      const res = await cloudinary.uploader.upload(avatar, {
        folder: "users",
        width: 1200,
        // height: 1200,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      });
      avatar = res.secure_url;
      user.avatar = avatar;
    }
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
    const query = specialization ? { specialization } : {};
    const users = await User.find(query);
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
      .populate({ path: "followers", select: "_id name avatar" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.followers);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserFollowingController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const user = await User.findById(id)
      .select("following")
      .populate({ path: "following", select: "_id name avatar" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.following);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserRoomsController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const user = await User.findById(id)
      .select("rooms")
      .populate({ path: "rooms", select: "_id title description image topic" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getUserActivityController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const activities = await Activity.find({ user: id }).populate({
      path: "room",
      select: "_id title image",
    });

    res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getFeaturedUsersController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          followersCount: { $size: "$followers" },
        },
      },
      {
        $sort: { followersCount: -1 },
      },
      {
        $limit: 4,
      },
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
