import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData, redirect } from "react-router-dom";
import axios from "axios";
import { addConnections } from "../store/connectionSlice";
import { showToast } from "../store/toastSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useLoaderData() || null;

  useEffect(() => {
    if (connections) {
      dispatch(addConnections(connections));
    } else {
      dispatch(showToast({ message: "Something went wrong!", type: "error" }));
    }
  }, [connections, dispatch]);

  return (
    <div>
      <h1 className="text-2xl mb-10 text-center sm:text-left">
        Your Connections
      </h1>

      {connections && connections.length > 0 ? (
        connections.map((connection, idx) => (
          <div
            key={idx}
            className="bg-base-100 rounded-xl mb-4 flex flex-col sm:flex-row items-center"
          >
            {/* Image with fixed size and responsive priority */}
            <div className="w-full sm:w-44 h-52 sm:h-44 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
              <img
                src={connection.photoUrl}
                alt="photo"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Details section */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full px-5 py-4 gap-4 sm:gap-0">
              <div className="text-center sm:text-left w-full">
                <h2 className="text-xl font-semibold">
                  {connection.firstName} {connection.lastName}
                </h2>

                <p>
                  {connection.gender}, {connection.age}
                </p>

                <p className="line-clamp-3 text-sm text-gray-400 mt-1">
                  {connection.about || "No about available"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl text-center">No Connections Yet!</p>
      )}
    </div>
  );
};

Connections.loader = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/users/connections`,
      { withCredentials: true }
    );

    if (res.status === 200) {
      return res?.data?.data;
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.error("loader error", error);
    return redirect("/login");
  }
};

export default Connections;
