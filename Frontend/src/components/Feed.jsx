import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

const Feed = () => {
  const user = useLoaderData();
  return <div> {user?.firstName}'s Feed</div>;
};

Feed.loader = async () => {
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

export default Feed;
