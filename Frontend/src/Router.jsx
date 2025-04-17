import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Feed from "./components/Feed/Feed";
import Profile from "./components/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={MainLayout.loader} element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/feed" loader={Feed.loader} element={<Feed />} />
      <Route
        path="/profiles/view"
          loader={Feed.loader}
        element={<Profile />}
      />
    </Route>
  )
);

export default router;
