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
      <h1 className="text-2xl mb-10">Your Connection Requests</h1>

      {requests && requests.length > 0 ? (
        requests.map((request) => (
          <div
            key={request._id}
            className="bg-base-100 rounded-xl mb-2 flex items-center"
          >
            <div className="h-40 w-40 overflow-hidden rounded-l-xl">
              <img src={request.photoUrl} alt="photo" />
            </div>

            <div className="flex items-center w-full justify-between px-5 py-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {request.firstName} {request.lastName}
                </h2>

                <p>
                  {request.gender}, {request.age}
                </p>

                <p className="w-11/12 line-clamp-3">{request.about || "No about available"}</p>
              </div>

              <div className="space-x-3 flex items-center">
                <button
                  onClick={() => handleRequest("accepted", request._id)}
                  className="btn btn-success"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest("rejected", request._id)}
                  className="btn btn-error btn-outline"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl">No Requests Yet!</p>
      )}
    </div>
  );
};

export default Requests;
