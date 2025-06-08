// IMPORT
import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./util/mongodb.ts";

// IMPORT ROUTES
import userRoutes from "./routes/user.route.ts";

// CONFIGS
dotenv.config();

// CONST
const PORT = process.env.PORT || 3000;

// APP
const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/user", userRoutes);

// LISTEN
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
  connectMongoDB();
});
