import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectToDB from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import requestRoutes from "./routes/request.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/profiles", profileRoutes);
app.use("/requests", requestRoutes);
app.use("/users", userRoutes);

connectToDB()
  .then(() => {
    console.log("DATABASE CONNECTED...");

    app.listen(process.env.PORT || 8080, () => {
      console.log(`SERVER IS LISTENING ON PORT ${process.env.PORT}...`);
    });
  })

  .catch((err) => {
    console.log("DATABASE CONNECTION ERROR", err);
  });
