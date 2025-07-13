import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import API from "../utils/axios";
import { useEffect } from "react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [data,setData]=useState([]);
  const handleLogout = async () => {
    try {
      await API.get("/logout", { withCredentials: true }); 
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token"); 
      navigate("/login"); 
    }
  };
  useEffect(()=>
  {
    const getNotifications=async()=>
    {
      const res = await API.get("/user/notifications");
      setData(res.data.data);

    }
    getNotifications();
  },[])

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
        <NotificationBell notifications={data} />

        <Link to={`/profile/${user?.username}`} title="Profile">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle
              size={28}
              className="text-gray-600 hover:text-indigo-600 transition"
            />
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-1 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
