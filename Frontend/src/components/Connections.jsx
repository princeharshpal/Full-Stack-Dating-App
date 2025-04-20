import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData } from "react-router-dom";
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
      <h1 className="text-2xl mb-10">Your Connections</h1>

      {connections && connections.length > 0 ? (
        connections.map((connection, idx) => (
          <div
            key={idx}
            className="bg-base-100 rounded-xl mb-2 flex items-center"
          >
            <div className="h-40 w-40 overflow-hidden rounded-l-xl">
              <img src={connection.photoUrl} alt="photo" />
            </div>

            <div className="flex items-center w-full justify-between px-5 py-2">
              <div>
                <h2 className="text-xl font-semibold">
                  {connection.firstName} {connection.lastName}
                </h2>

                <p>
                  {connection.gender}
                  {", "}
                  {connection.age}
                </p>

                <p>{connection.about || "No about available"}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-xl">No Connections Yet!</p>
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
