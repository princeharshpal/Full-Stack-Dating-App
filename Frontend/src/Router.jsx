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
import Profile from "./components/Profile/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import UpdatePass from "./components/UpdatePass";
import NotFound from "./components/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={MainLayout.loader} element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" loader={Profile.loader} element={<Profile />} />
      <Route
        path="/connections"
        loader={Connections.loader}
        element={<Connections />}
      />
      <Route path="/requests" element={<Requests />} />
      <Route path="/update-password" element={<UpdatePass />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default router;
