import { Router } from "express";
const router = Router();
import authUser from "../middlewares/auth.middleware.js";
import {
  connectionRequestValidations,
  reviewRequestValidations,
} from "../utils/validations.js";
import {
  reviewRequest,
  sendRequest,
} from "../controllers/request.controllers.js";

router.post(
  "/send/:status/:toUserId",
  authUser,
  connectionRequestValidations,
  sendRequest
);

router.post(
  "/review/:status/:fromUserId",
  authUser,
  reviewRequestValidations,
  reviewRequest
);

export default router;
