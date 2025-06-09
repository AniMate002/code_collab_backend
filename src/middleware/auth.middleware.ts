import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.ts";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const COOKIE_TOKEN_NAME = process.env.COOKIE_TOKEN_NAME;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET)
      return res.status(500).json({ message: "JWT_SECRET is not defined" });
    if (!COOKIE_TOKEN_NAME)
      return res
        .status(500)
        .json({ message: "COOKIE_TOKEN_NAME is not defined" });

    const token = req.cookies[COOKIE_TOKEN_NAME];
    if (!token) return res.status(403).json({ message: "Missing Token" });

    const parsedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!parsedToken) return res.status(403).json({ message: "Invalid Token" });

    const userId = parsedToken.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
