import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized request!" });
    }

    const id = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(id).select("-password -refreshToken");

    req.user = user;
    next();
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export default authUser;
