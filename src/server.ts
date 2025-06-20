// IMPORT
import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./util/mongodb.ts";
import cookieParser from "cookie-parser";
import cors from "cors";

// IMPORT ROUTES
import userRoutes from "./routes/user.route.ts";
import authRoutes from "./routes/auth.route.ts";
import roomRoutes from "./routes/room.route.ts";
import notificationRoutes from "./routes/notification.route.ts";

// CONFIGS
dotenv.config();

// CONST
const PORT = process.env.PORT || 3000;

// APP
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

// ROUTES
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/notification", notificationRoutes);

// LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
  connectMongoDB();
});
