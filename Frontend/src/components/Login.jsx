import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = yup
    .object({
      email: yup
        .string()
        .email("Invalid email address!")
        .required("Email is required!"),
      password: yup
        .string()
        .required("Password is required!")
        .min(6, "Password should be at least 6 characters long!")
        .matches(/[A-Z]/, "Password must have at least 1 uppercase letter!")
        .matches(/[a-z]/, "Password must have at least 1 lowercase letter!")
        .matches(/[0-9]/, "Password must have at least 1 number!")
        .matches(
          /[~`!@#$%^&*()_=+]/,
          "Password must have at least 1 special character!"
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
      email: "",
      password: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data, { abortEarly: false });

      const res = await axios.post(`${import.meta.env.VITE_URL}/login`, data, {
        withCredentials: true,
      });
      console.log(res);

      if (res.status === 200) {
        dispatch(addUser(res.data.user));
        navigate("/feed");
        reset();
      } else if (res.status === 401) {
        console.log("Invalid email or password");
        reset();
      }
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((validationError) => {
          setError(validationError.path, {
            type: "manual",
            message: validationError.message,
          });
        });
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fieldset w-xs bg-base-100 border border-base-100 p-4 rounded-box"
      >
        <p className="text-center font-semibold text-xl mb-2">Log in</p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="fieldset-label">
              Email
            </label>
            <input
              id="email"
              className="input focus:outline-none"
              placeholder="ex@example.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="fieldset-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input focus:outline-none"
              placeholder="123Example@"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn btn-soft btn-info"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Log in"}
          </button>
        </div>

        <div className="text-center mt-4 space-y-2">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          <p className="text-xs text-gray-500">
            By logging in, you agree to our{" "}
            <Link to="#" className="underline text-blue-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline text-blue-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
