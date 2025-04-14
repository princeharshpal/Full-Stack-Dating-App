import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

import connectToDB from "./config/database.js";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import requestRoutes  from "./routes/request.routes.js"

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/request", requestRoutes);

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
