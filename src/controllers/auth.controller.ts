import type { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import { generateAuthToken } from "../util/generateAuthToken.ts";
import bcrypt from "bcryptjs";

export const signUpAuthController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "Missing properties" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    generateAuthToken(user._id, res);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getMeAuthController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginAuthController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing properties" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid credentials" });

    generateAuthToken(user._id, res);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const logoutAuthController = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const COOKIE_TOKEN_NAME = process.env.COOKIE_TOKEN_NAME;
    if (!COOKIE_TOKEN_NAME)
      return res
        .status(500)
        .json({ message: "COOKIE_TOKEN_NAME is not defined" });

    res.clearCookie(COOKIE_TOKEN_NAME);
    req.user = null;
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
