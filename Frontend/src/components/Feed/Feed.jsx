import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { addFeed } from "../../store/feedSlice";
import Card from "./components/Card";

const Feed = () => {
  const feed = useLoaderData() || null;
  const dispatch = useDispatch();

  useEffect(() => {
    if (feed?.data) {
      dispatch(addFeed(feed.data));
    }
  }, [feed, dispatch]);

  return (
    <div>
      {/* {feed?.data?.map((item, idx) => { */}
      <Card key={""} user={feed.data[0]} />{/* })} */}
    </div>
  );
};

Feed.loader = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_URL}/users/feed/1/10`, {
      withCredentials: true,
    });

    if (res.status === 200) {
      return res.data;
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.log("loader error", error);
    return redirect("/login");
  }
};

export default Feed;
