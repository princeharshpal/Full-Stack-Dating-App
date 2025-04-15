import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
      trim: true,
      index: true,
      minLength: 3,
      maxLength: 10,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 20,
      select: false,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 80,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["male", "female", "others"],
    },
    about: {
      type: String,
      maxLength: 1000,
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
