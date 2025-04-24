import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import { validationResult } from "express-validator";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "../utils/asyncHandler.js";

const extractPublicId = (url) => {
  try {
    const regex = /upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)/;
    const match = url.match(regex);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.error("Failed to extract publicId:", error.message);
    return null;
  }
};

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(httpStatus.OK).json({ user: user });
});

export const deleteProfile = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;

  const user = await User.findByIdAndDelete(loggedInUser._id);

  if (user?.photoUrl) {
    const publicId = extractPublicId(user.photoUrl);

    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
    }
  }

  await ConnectionRequest.deleteMany({
    $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
  });

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(httpStatus.OK).json({
    message: "User account deleted successfully!",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
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

  const user = req?.user;

  if (req.file) {
    if (user.photoUrl) {
      const publicId = extractPublicId(user.photoUrl);

      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
      }
    }

    const newPhotoUrl = await uploadOnCloudinary(req.file?.path);
    updateData.photoUrl = newPhotoUrl;
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
});
