import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

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
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while generating tokens!",
      error: error.message,
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(httpStatus.EXPECTATION_FAILED).json(errors);
    }

    const { firstName, lastName, email, password, age, gender } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(httpStatus.EXPECTATION_FAILED)
        .json({ message: "User with this email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
    });

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User created successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid email or password!",
      });
    }

    const { accessToken, refreshToken } = await generateTokens({
      _id: user._id,
    });

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res
      .status(httpStatus.OK)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "User Logged in successfully!", user: loggedInUser });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const logOutUser = async (req, res) => {
  try {
    const id = req.user._id;

    await User.findByIdAndUpdate(id, {
      $set: {
        refreshToken: undefined,
      },
    });

    res
      .status(httpStatus.OK)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
      .json({ message: "User logged out successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized request!" });
    }

    const id = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

    const user = await User.findById(id);

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

    const { newAccessToken: accessToken, newRefreshToken: refreshToken } =
      await generateTokens(user._id);

    res
      .status(httpStatus.OK)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Access token refreshed successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const correctOldPass = await bcrypt.compare(oldPassword, user.password);

    if (!correctOldPass) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Entered old password is incorrect!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res
      .status(httpStatus.OK)
      .json({ message: "Password updated successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
