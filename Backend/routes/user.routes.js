import { Router } from "express";
const router = Router();
import {
  logInUser,
  logOutUser,
  refreshAccessToken,
  signUp,
  updatePassword,
} from "../controllers/user.controllers.js";
import {
  logInValidations,
  signUpValidations,
  updatePasswordValidations,
} from "../utils/validations.js";
import authUser from "../middlewares/auth.middleware.js";

router.post("/sign-up", signUpValidations, signUp);

router.post("/login", logInValidations, logInUser);

router.post("/logout", authUser, logOutUser);

router.post("/refresh-token", authUser, refreshAccessToken);

router.patch(
  "/update-password",
  authUser,
  updatePasswordValidations,
  updatePassword
);

export default router;
