import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const getSingleUserByIdController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, email, specialization } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.send(404).send({ message: "User not found" });
    user.name = name || user.name;
    user.email = email || user.email;
    user.specialization = specialization || user.specialization;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
