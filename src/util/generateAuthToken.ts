import jwt from "jsonwebtoken";
import type { Response } from "express";

export const generateAuthToken = (userId: string, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const COOKIE_TOKEN_NAME = process.env.COOKIE_TOKEN_NAME;
  if (!COOKIE_TOKEN_NAME) throw new Error("COOKIE_TOKEN_NAME is not defined");
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });

  res.cookie(COOKIE_TOKEN_NAME, token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    // secure: true,
    sameSite: "strict",
  });
};
