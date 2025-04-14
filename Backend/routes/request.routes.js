import { Router } from "express";
const router = Router();
import authUser from "../middlewares/auth.middleware.js";
import { connectionRequestValidations } from "../utils/validations.js";
import { sendRequest } from "../controllers/request.controllers.js";

router.post(
  "/send/:status/:toUserId",
  authUser,
  connectionRequestValidations,
  sendRequest
);

export default router;
