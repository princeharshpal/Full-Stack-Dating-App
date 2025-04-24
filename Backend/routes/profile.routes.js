import { Router } from "express";
const router = Router();
import authUser from "../middlewares/auth.middleware.js";
import { updateProfileValidations } from "../utils/validations.js";
import {
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

router.get("/view", authUser, getProfile);

router.patch(
  "/edit/:id",
  authUser,
  upload.single("photo"),
  updateProfileValidations,
  updateProfile
);

router.delete("/delete", authUser, deleteProfile);

export default router;
