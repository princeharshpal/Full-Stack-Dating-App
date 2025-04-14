import { Router } from "express";
const router = Router();
import authUser from "../middlewares/auth.middleware.js";
import { updateProfileValidations } from "../utils/validations.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controllers.js";

router.get("/view/:id", authUser, getProfile);

router.patch("/edit/:id", authUser, updateProfileValidations, updateProfile);

router.delete("/:id", authUser, deleteProfile);

export default router;
