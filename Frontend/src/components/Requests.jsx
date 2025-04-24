import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showToast } from "../store/toastSlice";
import { addRequests, removeRequest } from "../store/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/users/requests/recieved`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          dispatch(addRequests(res.data.data));
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        dispatch(
          showToast({ message: "Something went wrong!", type: "error" })
        );
      }
    };

    fetchRequests();
  }, [dispatch]);

  const handleRequest = async (status, fromUserId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/requests/review/${status}/${fromUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(removeRequest(fromUserId));
        dispatch(showToast({ message: res.data.message, type: "success" }));
      }
    } catch (error) {
      console.error("Error handling request:", error);
      dispatch(
        showToast({ message: "Failed to update request.", type: "error" })
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-10 text-center sm:text-left">
        Your Connection Requests
      </h1>

      {requests && requests.length > 0 ? (
        requests.map((request) => (
          <div
            key={request._id}
            className="bg-base-100 rounded-xl mb-4 flex flex-col sm:flex-row items-center"
          >
            {/* Image container */}
            <div className="w-full sm:w-44 h-52 sm:h-44 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
              <img
                src={request.photoUrl}
                alt="photo"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text and button section */}
            <div className="flex flex-col sm:flex-row items-center w-full justify-between px-5 py-4 gap-4 sm:gap-0">
              <div className="text-center sm:text-left w-full sm:w-8/12">
                <h2 className="text-xl font-semibold">
                  {request.firstName} {request.lastName}
                </h2>
                <p>
                  {request.gender}, {request.age}
                </p>
                <p className="line-clamp-3 mt-1 text-sm text-gray-400">
                  {request.about || "No about available"}
                </p>
              </div>

              <div className="flex justify-center sm:justify-end items-center gap-3 w-full sm:w-4/12">
                <button
                  onClick={() => handleRequest("accepted", request._id)}
                  className="btn btn-success btn-sm sm:btn-md"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest("rejected", request._id)}
                  className="btn btn-error btn-outline btn-sm sm:btn-md"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl text-center">No Requests Yet!</p>
      )}
    </div>
  );
};

export default Requests;
