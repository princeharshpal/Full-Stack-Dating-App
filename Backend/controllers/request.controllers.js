import { validationResult } from "express-validator";
import { ConnectionRequest } from "../models/connectionRequest.model.js";
import httpStatus from "http-status";
import { User } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";

export const sendRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: errors });
  }

  const fromUserId = req.user?._id;
  const { toUserId, status } = req.params;

  const sameId = fromUserId.toString() === toUserId.toString();

  if (sameId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Cannot send connection request to yourself!" });
  }

  const toUserExists = await User.findById(toUserId);

  if (!toUserExists) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "User not found!" });
  }

  const connectionRequestExists = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (connectionRequestExists) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Connection request already exists!" });
  }

  const connectionSent = await ConnectionRequest.create({
    fromUserId,
    status,
    toUserId,
  });

  res.status(httpStatus.OK).json({
    message: `Connection request ${status}!`,
    request: connectionSent,
  });
});

export const reviewRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: errors });
  }

  const { status, fromUserId } = req.params;
  const loggedInUser = req.user;

  const connectionRequest = await ConnectionRequest.findOne({
    fromUserId,
    toUserId: loggedInUser._id,
    status: "interested",
  });

  if (!connectionRequest) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Connection request not found" });
  }

  connectionRequest.status = status;

  const data = await connectionRequest.save();

  res
    .status(httpStatus.OK)
    .json({ message: `The request has been ${status}`, data: data });
});
