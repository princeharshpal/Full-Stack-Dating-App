import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import { validationResult } from "express-validator";

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
    const id = req.params?.id;

    await User.findByIdAndDelete(id);

    res.status(httpStatus.OK).json({ message: "User deleted successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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

    const { firstName, lastName, about, photoUrl } = req.body;

    await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      about,
      photoUrl,
    });

    res.status(httpStatus.OK).json({ message: "User updated successfully!" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
