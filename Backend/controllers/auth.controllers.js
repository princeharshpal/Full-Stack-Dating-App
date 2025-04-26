import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const generateTokens = (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Error generating tokens: " + error.message);
  }
};

export const signUp = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(httpStatus.EXPECTATION_FAILED).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  const { firstName, lastName, email, password, age, gender } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    return res
      .status(httpStatus.EXPECTATION_FAILED)
      .json({ message: "User with this email already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    age,
    gender,
  });

  const { accessToken, refreshToken } = generateTokens({
    _id: createdUser._id,
  });

  createdUser.refreshToken = refreshToken;
  await createdUser.save();

  return res
    .status(httpStatus.CREATED)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json({
      user: createdUser,
      message: "User created successfully!",
    });
});

export const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid email or password!",
    });
  }

  const { accessToken, refreshToken } = generateTokens({
    _id: user._id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  const loggedInUser = await User.findById(user._id);

  res
    .status(httpStatus.OK)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "User Logged in successfully!", user: loggedInUser });
});

export const logOutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  await User.findByIdAndUpdate(id, {
    $set: {
      refreshToken: null,
    },
  });

  res
    .status(httpStatus.OK)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({ message: "User logged out successfully!" });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Unauthorized request!" });
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id).select("+refreshToken");

  if (!user) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Invalid refresh token!" });
  }

  if (incomingRefreshToken !== user.refreshToken) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Refresh token is expired or used!" });
  }

  const { accessToken, refreshToken } = generateTokens({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res
    .status(httpStatus.OK)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Access token refreshed successfully!" });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id).select("+password");

  const correctOldPass = await bcrypt.compare(oldPassword, user.password);

  if (!correctOldPass) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Entered old password is incorrect!" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  res.status(httpStatus.OK).json({ message: "Password updated successfully!" });
});
