import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../store/toastSlice";

const Label = ({ children, required = false, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="block mb-1 text-sm text-gray-400 font-medium"
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = yup
    .object({
      firstName: yup
        .string()
        .required("First name is required!")
        .min(3, "First name is at least 3 characters long! "),
      lastName: yup
        .string()
        .min(3, "Last name should have at least 3 characters long!"),
      age: yup
        .number()
        .typeError("Age must be a number!")
        .required("Age is required!")
        .min(18, "Age must be between 18 and 60")
        .max(60, "Age must be between 18 and 60"),
      gender: yup
        .string()
        .required("Gender is required!")
        .oneOf(["male", "female", "others"], "Select a valid gender!"),
      email: yup
        .string()
        .email("Invalid email!")
        .required("Email is required!")
        .max(50, "Email length is too long!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Password must be at least 6 characters!")
        .max(50, "Your Password is too long!")
        .matches(/[A-Z]/, "Must include at least one uppercase letter!")
        .matches(/[a-z]/, "Must include at least one lowercase letter!")
        .matches(/[0-9]/, "Must include at least one number!")
        .matches(
          /[~`!@#$%^&*()_=+]/,
          "Must include at least one special character!"
        ),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/sign-up`,
        data,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        dispatch(addUser(res.data.user));
        dispatch(showToast({ message: res.data.message, type: "success" }));
        navigate("/feed");
        reset();
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        dispatch(
          showToast({ message: err.response.data.message, type: "error" })
        );
      } else if (err.inner) {
        err.inner.forEach((validationError) => {
          setError(validationError.path, {
            type: "manual",
            message: validationError.message,
          });
        });
      } else {
        dispatch(
          showToast({ message: "Something went wrong.", type: "error" })
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl bg-base-100 border border-base-300 p-6 rounded-box shadow-md"
      >
        <h2 className="text-xl font-semibold text-center mb-6 text-white">
          Sign Up
        </h2>

        <div className="space-y-4 text-base-content">
          <div className="md:flex md:gap-4">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <Label htmlFor="firstName" required>
                First Name
              </Label>
              <input
                id="firstName"
                className="input w-full focus:outline-none"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="md:w-1/2">
              <Label htmlFor="lastName">Last Name</Label>
              <input
                id="lastName"
                className="input w-full focus:outline-none"
                {...register("lastName")}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="age" required>
                Age
              </Label>
              <input
                id="age"
                className="input w-full focus:outline-none"
                {...register("age")}
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>

            <div className="w-1/2">
              <Label htmlFor="gender" required>
                Gender
              </Label>
              <select
                id="gender"
                className="select w-full focus:outline-none"
                {...register("gender")}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="md:flex md:gap-4">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <Label htmlFor="email" required>
                Email
              </Label>
              <input
                id="email"
                type="email"
                className="input w-full focus:outline-none"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="md:w-1/2">
              <Label htmlFor="password" required>
                Password
              </Label>
              <input
                id="password"
                type="password"
                className="input w-full focus:outline-none"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-info btn-block mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
