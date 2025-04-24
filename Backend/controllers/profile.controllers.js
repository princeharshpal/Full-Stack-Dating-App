import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import { validationResult } from "express-validator";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    return res.status(httpStatus.OK).json({ user: user });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const user = await User.findByIdAndDelete(loggedInUser._id);

    const deletedConnections = await ConnectionRequest.deleteMany({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(httpStatus.OK).json({
      message: "User account deleted successfully!",
      // "logged in user": loggedInUser,
      // "deleted user": user,
      // "deleted connections": deletedConnections,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(httpStatus.EXPECTATION_FAILED).json(errors);
    }

    const id = req.params?.id;

    const { firstName, lastName, about } = req.body;

    const updateData = {
      firstName,
      lastName,
      about,
    };

    if (req.file) {
      const photoUrl = await uploadOnCloudinary(req.file.path);
      updateData.photoUrl = photoUrl;
    }

    const updateProfile = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateProfile) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }

    res
      .status(httpStatus.OK)
      .json({ message: "User updated successfully!", user: updateProfile });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
