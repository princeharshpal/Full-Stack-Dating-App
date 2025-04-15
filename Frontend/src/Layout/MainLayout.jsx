import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-base-200 p-7">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
