import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";

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
    //   TODO: make follow/unfollow logic adding authorization
    res.status(200).json({ message: "Follow/Unfollow user" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
