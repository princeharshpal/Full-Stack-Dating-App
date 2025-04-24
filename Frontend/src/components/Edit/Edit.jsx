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
      .mixed()
      .test("fileRequired", "Photo is required", (value) => value && value[0])
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || value[0].size <= 1048576 // 1MB max file size
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          !value ||
          ["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type)
      ),
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
    formState: { errors, isDirty, isSubmitting },
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
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("about", data.about);

      if (data.photoUrl[0]) {
        formData.append("photo", data.photoUrl[0]);
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/profiles/edit/${user._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        reset({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          age: res.data.user.age,
          gender: res.data.user.gender,
          photoUrl: res.data.user.photoUrl,
          about: res.data.user.about,
        });
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

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
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
              type="file"
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
            {errors.about && (
              <p className="text-xs text-red-500">{errors.about.message}</p>
            )}
          </div>

          <button
            disabled={!isDirty || isSubmitting}
            type="submit"
            className="btn btn-warning w-full mt-2"
          >
            {isSubmitting ? "  Saving... Please wait!" : "save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
