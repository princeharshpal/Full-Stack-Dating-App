import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { showToast } from "../store/toastSlice";
import { removeConnections } from "../store/connectionSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        dispatch(removeUser());
        dispatch(removeConnections());
        dispatch(showToast({ message: res.data.message, type: "success" }));
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      dispatch(
        showToast({
          message: "Something went wrong. Please try again.",
          type: "error",
        })
      );
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setShowDeleteModal(false);

      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/profiles/delete`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        dispatch(removeUser());
        dispatch(removeConnections());
        dispatch(showToast({ message: res.data.message, type: "success" }));
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      dispatch(
        showToast({
          message: "Something went wrong. Please try again.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={"/feed"} className="btn btn-ghost text-xl">
          Lets Connect . . .
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        {user ? (
          <>
            <p className="text-gray-400 text-lg">Welcome, {user?.firstName}</p>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="user photo"
                    src={user?.photoUrl || "/default-avatar.png"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-5 mt-5 w-52 p-4 shadow"
              >
                <li>
                  <Link to={"/profile"}>Profile</Link>
                </li>

                <li>
                  <Link to={"/connections"}>Connections</Link>
                </li>

                <li>
                  <Link to={"/requests"}>Requests</Link>
                </li>

                <li>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-500"
                  >
                    Delete my account
                  </button>
                </li>

                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {currentPath !== "/login" && (
              <Link to="/login" className="btn btn-soft btn-info">
                Login
              </Link>
            )}
            {currentPath !== "/signup" && (
              <Link to="/signup" className="btn btn-soft btn-info">
                Sign Up
              </Link>
            )}
          </>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-base-300 p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-6 text-sm text-gray-400">
              This action will permanently delete your account.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-sm bg-red-500 hover:bg-red-800"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
