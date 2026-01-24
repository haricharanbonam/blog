import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import API from "../utils/axios";
import { useEffect } from "react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [data,setData]=useState([]);
  const handleLogout = async () => {
    try {
      await API.post("user/logout", { withCredentials: true }); 
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
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
    <nav className="bg-[#0a0a0a] border-b border-white/10 px-6 py-4 flex justify-between items-center relative z-50">
      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 tracking-wide cursor-pointer" onClick={()=>navigate('/')}>
        BlogX
      </div>

      <div className="flex space-x-8">
        <Link
          to="/"
          className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
        >
          Blogs
        </Link>
        <Link
          to="/create"
          className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
        >
          Create
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <NotificationBell notifications={data} />

        <Link to={`/profile/${user?.username}`} title="Profile" className="hover:opacity-80 transition-opacity">
          {user?.avatarUrl ? (
            <img
              src={user?.avatarUrl}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-purple-500/50"
            />
          ) : (
            <FaUserCircle
              size={28}
              className="text-slate-300 hover:text-white transition"
            />
          )}
        </Link>
        <button
          onClick={handleLogout}
          className="px-5 py-1.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
