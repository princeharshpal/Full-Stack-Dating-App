import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          Lets Connect . . .
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        {user ? (
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
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
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
    </div>
  );
};

export default Navbar;
