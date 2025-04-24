import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const authUser = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized request!" });
  }

  const id = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(id);

  req.user = user;
  next();
});

export default authUser;
