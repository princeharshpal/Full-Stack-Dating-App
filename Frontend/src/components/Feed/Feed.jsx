import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addFeed } from "../../store/feedSlice";
import Card from "./components/Card";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/users/feed/1/10`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        dispatch(addFeed(res.data.data)); 
        // console.log(res.data.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("fetch feed error:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    getFeed();
  }, [dispatch]);

  return (
    <div>
      {feed && feed.length > 0 ? (
        <Card user={feed[0]} />
      ) : (
        <p>No feed to show!</p>
      )}
    </div>
  );
};

export default Feed;
