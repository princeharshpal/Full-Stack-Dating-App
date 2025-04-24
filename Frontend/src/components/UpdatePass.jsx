import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToast } from "../store/toastSlice";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Old password is required")
    .min(6, "Minimum 6 characters")
    .max(50, "Maximum 50 characters"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Minimum 6 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[~`!@#$%^&*()_=+]/, "Must include a special character"),
  confirmPassword: yup
    .string()
    .required("Please confirm your new password")
    .oneOf([yup.ref("newPassword"), null], "Passwords do not match"),
});

const UpdatePass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/update-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        reset();
        navigate("/profile");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(
          showToast({ message: err.response.data.message, type: "error" })
        );
      } else {
        dispatch(showToast({ message: "Something went wrong", type: "error" }));
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 bg-base-300 border border-base-100 p-6 rounded-box"
      >
        <p className="text-center font-semibold text-2xl mb-2">
          Update Password
        </p>

        <div className="space-y-6">
          <div>
            <label className="fieldset-label text-xs mb-1" htmlFor="oldPass">
              Old Password
            </label>

            <div className="relative">
              <input
                id="oldPass"
                type={showOld ? "text" : "password"}
                placeholder="Old password"
                className="input w-full focus:outline-none pr-10"
                {...register("oldPassword")}
              />
              <span
                onClick={() => setShowOld(!showOld)}
                className="absolute top-2.5 right-3 cursor-pointer text-sm text-gray-500"
              >
                {showOld ? "Hide" : "Show"}
              </span>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-red-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="fieldset-label text-xs mb-1" htmlFor="newPass">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPass"
                type={showNew ? "text" : "password"}
                placeholder="New password"
                className="input w-full focus:outline-none pr-10"
                {...register("newPassword")}
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute top-2.5 right-3 cursor-pointer text-sm text-gray-500"
              >
                {showNew ? "Hide" : "Show"}
              </span>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="fieldset-label text-xs mb-1" htmlFor="confPass">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confPass"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="input w-full focus:outline-none pr-10"
                {...register("confirmPassword")}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-2.5 right-3 cursor-pointer text-sm text-gray-500"
              >
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn btn-info"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePass;
