import { Router } from "express";
import authUser from "../middlewares/auth.middleware.js";
import {
  getAllConnections,
  getAllRequestsReceived,
  getFeed,
} from "../controllers/user.controllers.js";
import { feedValidations } from "../utils/validations.js";
const router = Router();

router.get("/requests/recieved", authUser, getAllRequestsReceived);

router.get("/connections", authUser, getAllConnections);

router.get("/feed/:pageNo/:limit", authUser, feedValidations, getFeed);

export default router;
