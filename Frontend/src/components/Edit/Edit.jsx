import React, { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import Card from "../Feed/components/Card";
import { showToast } from "../../store/toastSlice";

const Edit = ({ user }) => {
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("First name is required")
      .min(3, "First name is at least 3 characters long!"),
    lastName: yup
      .string()
      .required("Last name is required")
      .min(3, "Last name should have at least 3 characters long!"),
    photoUrl: yup
      .string()
      .url("Photo URL must be valid")
      .max(2048, "Photo URL is too long"),
    about: yup
      .string()
      .required("About section is required")
      .max(1000, "About can only be written in 1000 letters!"),
    age: yup.number().notRequired(),
    gender: yup.string().notRequired(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age || "",
      gender: user.gender || "",
      photoUrl: user.photoUrl || "",
      about: user.about || "",
    },
  });

  useEffect(() => {
    reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      age: user.age || "",
      gender: user.gender || "",
      photoUrl: user.photoUrl || "",
      about: user.about || "",
    });
  }, [user]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/profiles/edit/${user._id}`,
        data,
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      dispatch(showToast({ message: error.message, type: "error" }));
    }
  };

  return (
    <div className="flex gap-5">
      <Card user={watch()} />

      <div className="bg-base-100 p-5 rounded-md space-y-3">
        <h2 className="text-xl font-semibold text-center">Edit your profile</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className="text-sm text-gray-400">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              className="border border-gray-600 rounded-md px-2 py-1 outline-none"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className="text-sm text-gray-400">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              className="border border-gray-600 rounded-md px-2 py-1 outline-none"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex w-1/2 flex-col gap-1">
              <label htmlFor="age" className="text-sm text-gray-500">
                Age
              </label>
              <input
                type="number"
                disabled
                {...register("age")}
                className="border border-gray-700 rounded-md text-gray-400 px-2 py-1 outline-none"
              />
            </div>

            <div className="flex w-1/2 flex-col gap-1">
              <label htmlFor="gender" className="text-sm text-gray-500">
                Gender
              </label>

              <select
                disabled
                className="border border-gray-700 text-gray-500 rounded-md px-2 py-1 outline-none"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="photoUrl" className="text-sm text-gray-400">
              Photo URL
            </label>
            <input
              id="photoUrl"
              type="text"
              {...register("photoUrl")}
              className="border border-gray-600 rounded-md px-2 py-1 outline-none"
            />
            {errors.photoUrl && (
              <p className="text-xs text-red-500">{errors.photoUrl.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="about" className="text-sm text-gray-400">
              About
            </label>
            <textarea
              id="about"
              rows={3}
              {...register("about")}
              className="border border-gray-600 rounded-md px-2 py-1 outline-none"
            />
          </div>

          <div className="flex gap-4 mt-5">
            <button type="submit" className="btn btn-outline btn-warning w-40">
              Save
            </button>

            <button type="button" className="btn btn-error w-40">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
