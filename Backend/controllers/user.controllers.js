import { ConnectionRequest } from "../models/connectionRequest.model.js";
import httpStatus from "http-status";
import { User } from "../models/user.models.js";

const userSafeData = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "about",
  "photoUrl",
];

export const getAllRequestsReceived = async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const allRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", userSafeData);

    const data = allRequests.map((row) => row.fromUserId);

    res.status(httpStatus.OK).json({ data: data });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const getAllConnections = async (req, res) => {
  try {
    const loggedInUser = req?.user;

    const allConnections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = allConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(httpStatus.OK).json({ data: data });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const loggedInUser = req?.user;
    let pageNo = parseInt(req.params.pageNo) || 1;
    let limit = parseInt(req.params.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (pageNo - 1) * limit;

    const connectionsRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionsRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const usersForFeed = await User.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUserFromFeed) } },
      ],
    })
      .skip(skip)
      .limit(limit);

    res.status(httpStatus.OK).json({ data: usersForFeed });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
