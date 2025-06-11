import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
const Navbar = ({ isLoggedIn }) => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-2xl font-extrabold text-indigo-600 tracking-wide">
        BlogX
      </div>

      <div className="flex space-x-6">
        <Link
          to="/blogs"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Blogs
        </Link>
        <Link
          to="/create"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Create
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/profile" title="Profile">
              <FaUserCircle
                size={28}
                className="text-gray-600 hover:text-indigo-600 transition"
              />
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("accessToken"); // remove token on logout
                window.location.reload(); // refresh app to update state
              }}
              className="px-4 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-1 rounded-full border border-indigo-500 text-indigo-500 hover:bg-indigo-50 transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
