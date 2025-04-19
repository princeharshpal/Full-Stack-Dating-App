import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Edit from "../Edit/Edit";

const Profile = () => {
  const user = useLoaderData() || null;

  return (
    <div className="flex flex-wrap justify-center items-start gap-5 mt-5">
      {user ? (
        <Edit user={user} />
      ) : (
        <p className="text-2xl">Something went wrong!</p>
      )}
    </div>
  );
};

Profile.loader = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_URL}/profiles/view`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data.user;
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.log("loader error", error);
    return redirect("/login");
  }
};

export default Profile;
