import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import FollowGrid from "./Follow/FollowGrid";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // close icon (from lucide-react)

function Followers() {
  const { username } = useParams();
  const [toggleOn, setToggleOn] = useState(true); // true = followers, false = following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/user/followinfo/${username}`, {
          withCredentials: true,
        });
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
      } catch (err) {
        console.error("Error fetching followers and following:", err);
      }
    };
    fetchData();
  }, [username]);

  const handleClick = (person) => {
    navigate(`/profile/${person.username}`);
  };

  const handleClose = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative bg-white rounded-xl shadow-lg w-96 p-4">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black transition"
          onClick={handleClose}
        >
          <X size={20} />
        </button>

        <div className="flex border-b border-gray-300 mt-2">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              toggleOn
                ? "text-black relative after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-0.5 after:bg-black"
                : "text-gray-500"
            }`}
            onClick={() => setToggleOn(true)}
          >
            Followers
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              !toggleOn
                ? "text-black relative after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-0.5 after:bg-black"
                : "text-gray-500"
            }`}
            onClick={() => setToggleOn(false)}
          >
            Following
          </button>
        </div>

        <div className="mt-4">
          <FollowGrid
            persons={toggleOn ? followers : following}
            onFollow={() => {}}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}

export default Followers;
