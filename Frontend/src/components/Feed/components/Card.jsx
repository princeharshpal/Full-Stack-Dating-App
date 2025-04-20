import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../store/toastSlice";
import { removeUserFromFeed } from "../../../store/feedSlice";
import { useLocation } from "react-router-dom";

const Card = ({ user }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { _id, firstName, lastName, photoUrl, about, age, gender } = user;

  const handleConnection = async (status, toUserId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/requests/send/${status}/${toUserId}`,
        {},
        { withCredentials: true }
      );

      const dis = dispatch(removeUserFromFeed(toUserId));
      // console.log(dis);
      // console.log(res);

      if (res.status === 200) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="card bg-base-100 w-96 shadow-sm overflow-hidden">
        <figure className="h-98 w-full">
          <img
            className="object-center object-cover rounded-md"
            src={photoUrl}
            alt="user photo"
          />
        </figure>

        <div className="card-body">
          <h2 className="card-title">
            {firstName} {lastName}
          </h2>

          <p>
            {gender}, {age}
          </p>

          <p className="line-clamp-2 text-sm">
            {about || "No description available."}
          </p>

          {location.pathname !== "/profile" && (
            <div className="flex justify-center items-center gap-8 mt-2">
              <button
                onClick={() => {
                  handleConnection("ignored", _id);
                }}
                className="btn btn-primary btn-outline"
              >
                Ignore
              </button>
              <button
                onClick={() => {
                  handleConnection("interested", _id);
                }}
                className="btn btn-secondary"
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
