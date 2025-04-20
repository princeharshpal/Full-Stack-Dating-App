import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addUser } from "../store/userSlice";

const MainLayout = () => {
  const user = useLoaderData() || null;
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      dispatch(addUser(user));
    }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <div
        className={`${
          location.pathname === "/" ? "" : "w-full min-h-[90vh] bg-base-200 p-7"
        }`}
      >
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

MainLayout.loader = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_URL}/profiles/view`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data.user;
    } else return null;
  } catch (error) {
    console.log("Layout loader error", error);
    return null;
  }
};

export default MainLayout;
