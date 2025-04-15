import { body, param } from "express-validator";

export const signUpValidations = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name is at least 3 characters long!"),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage("Last name should have at least 3 characters long!"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address!")
    .isLength({ max: 20 })
    .withMessage("Email length is too long!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 characters long!")
    .isLength({ max: 50 })
    .withMessage("Your Password is too long!")
    .isStrongPassword()
    .withMessage("Your Password is too weak!"),
  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 18, max: 60 })
    .withMessage("Age must be between 18 and 60"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isLength({ min: 4 })
    .withMessage("Gender should be at least 4 characters long!")
    .isLength({ max: 6 })
    .withMessage("Gender could be maximum 6 characters long!")
    .customSanitizer((value) => value.toLowerCase())
    .isIn(["male", "female", "others"])
    .withMessage("Invalid role. Allowed roles: male, female, others!"),
];

export const logInValidations = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email address!")
    .isLength({ max: 20 })
    .withMessage("Email length is too long!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 characters long!")
    .isLength({ max: 50 })
    .withMessage("Your Password is too long!"),
];

export const updateProfileValidations = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name is at least 3 characters long!"),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage("Last name should have at least 3 characters long!"),
  body("about")
    .notEmpty()
    .withMessage("About section is required")
    .isLength({ max: 1000 })
    .withMessage("About can only written in 1000 letters!"),
  body("photoUrl")
    .isURL()
    .withMessage("Invalid URL!")
    .isLength({ max: 200 })
    .withMessage("Photo url is too long"),
];

export const updatePasswordValidations = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 characters long!")
    .isLength({ max: 50 })
    .withMessage("Your Password is too long!"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 characters long!")
    .isLength({ max: 50 })
    .withMessage("Your Password is too long!"),
];

export const connectionRequestValidations = [
  param("status")
    .customSanitizer((value) => value.toLowerCase())
    .isIn(["interested", "ignored"])
    .withMessage("Invalid status. Allowed status: interested, ignored!"),
  param("toUserId").isMongoId().withMessage("Invalid id to send a request!"),
];

export const reviewRequestValidations = [
  param("status")
    .customSanitizer((value) => value.toLowerCase())
    .isIn(["accepted", "rejected"])
    .withMessage("Invalid status. Allowed status: accepted, rejected!"),
  param("fromUserId").isMongoId().withMessage("Invalid id to send a request!"),
];
