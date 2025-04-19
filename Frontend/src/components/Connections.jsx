import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoaderData, redirect } from "react-router-dom";
import { showToast } from "../store/toastSlice";
import axios from "axios";
import { addConnections } from "../store/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useLoaderData() || null;

  useEffect(() => {
    dispatch(addConnections(connections));
  }, [connections, dispatch]);

  return (
    <div>
      {connections.map((connection, idx) => {
        return (
          <div className="card card-side bg-base-100 shadow-sm mb-5">
            <figure>
              <img
                className="max-w-60 h-40 object-top object-cover"
                src={
                  connection?.photoUrl ||
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                }
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">
                {connection.firstName} {connection.lastName}
              </h2>

              <p>
                {connection.age}
                {", "}
                {connection.gender}
              </p>

              <p>{connection.about || "No about available!"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

Connections.loader = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/users/connections`,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      return res?.data?.data;
    } else {
      return redirect("/login");
    }
  } catch (error) {
    console.log("loader error", error);
    return redirect("/login");
  }
};

export default Connections;
