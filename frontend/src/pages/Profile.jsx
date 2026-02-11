import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { uploadFile } from "../utils/uploadFile";
import Popup from "../utils/Popup";
import BlogGrid from "../components/BlogGrid";
import FollowGrid from "../components/Follow/FollowGrid";
import Navbar from "../components/NavBar";
import { X } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showpopup, setShowPopup] = useState(false);
  const [PopupMessage, setPopupMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(true);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [toggleOn, setToggleOn] = useState(true); // true = followers, false = following
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const fileInputRef = useRef(null);
  const [newData, setNewData] = useState({
    fullName: "",
    aboutme: "",
    Profession: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get(`/user/profile/${username}`);
        setUserData(res.data);
        setIsFollowing(res.data.isFollowing);

        setNewData({
          fullName: res.data.fullName || "",
          aboutme: res.data.aboutme || "",
          Profession: res.data.Profession || "",
        });
      } catch (error) {
        navigate("/notfound");
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username, navigate]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const updateInputHandler = (e) => {
    setNewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/user/update-details", {
        fullName: newData.fullName,
        aboutme: newData.aboutme,
        Profession: newData.Profession,
      });

      if (res.status === 200) {
        setUserData((prev) => ({
          ...prev,
          fullName: newData.fullName,
          aboutme: newData.aboutme,
          Profession: newData.Profession,
        }));
        setShowPopup(true);
        setPopupMessage("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return;
    } finally {
      setShowModal(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    let uploadedUrl = "";

    try {
      uploadedUrl = await uploadFile(file, "/user/update-avatar");
      if (!uploadedUrl) {
        alert("Upload failed. Please try again.");
        return;
      }

      setShowPopup(true);
      setPopupMessage("Avatar updated successfully!");
    } catch (err) {
      alert("Upload failed.");
      return;
    }

    setUserData((prev) => ({
      ...prev,
      avatarUrl: uploadedUrl,
    }));
  };

  const handleFollowToggle = async () => {
    try {
      const res = await API.put(`/user/follow/${username}`);
      if (res.status === 200) {
        if (isFollowing) {
          setUserData((prev) => ({
            ...prev,
            followers: prev.followers.filter(
              (follower) => follower._id !== res.data.followerId
            ),
          }));
        } else {
          setUserData((prev) => ({
            ...prev,
            followers: [...prev.followers, res.data.follower],
          }));
        }

        setIsFollowing((prev) => !prev);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setShowPopup(true);
      setPopupMessage("Error toggling follow status. Please try again.");
    }
  };

  if (!userData)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-6 border-purple-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="bg-[#1a1a1a] shadow-md rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-start border border-white/10">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {userData.fullName}
            </h1>
            <p className="text-gray-400">@{userData.username}</p>
            <p className="mt-4 text-gray-300">
              <strong className="text-white">About Me:</strong>{" "}
              {userData.aboutme || "Not provided"}
            </p>
            <p className="text-gray-300 mt-2">
              <strong className="text-white">Profession:</strong>{" "}
              {userData.Profession || "Not provided"}
            </p>
          </div>

          <div className="flex flex-col items-center w-full md:w-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            {userData.avatarUrl ? (
              <a target="_blank" href={userData.avatarUrl} rel="noreferrer">
                <img
                  src={userData.avatarUrl}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50 mb-2"
                />
              </a>
            ) : (
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl flex items-center justify-center font-bold shadow-lg mb-2"
              >
                {userData.fullName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-4 w-full">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition text-sm border border-white/10">
                {userData.followers?.length || 0} Followers
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full transition text-sm border border-white/10">
                {userData.following?.length || 0} Following
              </button>
            </div>

            <div className="flex gap-3 mt-3 w-full justify-center">
                <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-full shadow text-sm font-medium transition w-full md:w-auto
                    ${userData.owner && "hidden"}
                    ${
                        isFollowing
                        ? "bg-transparent border border-gray-500 text-white hover:bg-white/10"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                    }`}
                >
                {isFollowing ? "Unfollow" : "Follow"}
                </button>
             </div>
             
             <p
              className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium text-sm mt-3"
              onClick={async () => {
                try {
                  const res = await API.get(`/user/followinfo/${username}`);
                  setFollowers(res.data.followers);
                  setFollowing(res.data.following);
                  setShowFollowModal(true);
                } catch (err) {
                  console.error("Error fetching followers and following:", err);
                }
              }}
            >
              View Connections
            </p>

            <button
              className={`mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition border border-white/10 ${
                userData?.owner === true ? "" : "hidden"
              }`}
              onClick={() => setShowModal(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-purple-500 pl-4">Liked Posts</h2>
        <BlogGrid blogs={userData.likedPosts} onBlogClick={handleBlogClick} />
        
        <h2 className="text-2xl font-bold mb-6 mt-12 text-white border-l-4 border-purple-500 pl-4">My Posts</h2>
        <BlogGrid blogs={userData.myPosts} onBlogClick={handleBlogClick} />
        
        <h2 className="text-2xl font-bold mb-6 mt-12 text-white border-l-4 border-purple-500 pl-4">Saved Posts</h2>
        <BlogGrid blogs={userData.savedPosts} onBlogClick={handleBlogClick} />

        {/* Edit Profile Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-white/10">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

              <div className="flex justify-center mb-6">
                <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                />
                <div className="relative group">
                    {userData.avatarUrl ? (
                    <img
                        src={userData.avatarUrl}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/50"
                    />
                    ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl flex items-center justify-center font-bold">
                        {userData.fullName.charAt(0).toUpperCase()}
                    </div>
                    )}
                     <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white font-medium text-sm"
                    >
                        Change
                    </label>
                </div>
              </div>

              <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="w-full bg-[#2a2a2a] border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-purple-500 transition"
                        defaultValue={userData.fullName}
                        onChange={updateInputHandler}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Profession</label>
                    <select
                        name="Profession"
                        value={newData.Profession || userData.Profession || ""}
                        onChange={updateInputHandler}
                        className="w-full bg-[#2a2a2a] border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-purple-500 transition"
                    >
                        <option value="" disabled className="text-gray-500">Select your profession</option>
                        <option value="Student">Student</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                     <label className="block text-gray-400 text-sm mb-1">About Me</label>
                     <textarea
                        name="aboutme"
                        rows="4"
                        defaultValue={userData.aboutme || ""}
                        onChange={updateInputHandler}
                        className="w-full bg-[#2a2a2a] border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-purple-500 transition"
                        placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
              </div>
              
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg mt-6 hover:opacity-90 transition shadow-lg shadow-purple-900/20"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {showpopup && (
          <Popup message={PopupMessage} onClose={() => setShowPopup(false)} />
        )}

        {/* Following/Followers Modal */}
        {showFollowModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
            <div className="relative bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md p-6 border border-white/10 h-[500px] flex flex-col">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                onClick={() => setShowFollowModal(false)}
              >
                <X size={24} />
              </button>

              <div className="flex border-b border-white/10 pb-2 mb-4">
                <button
                  className={`flex-1 py-2 text-center font-medium transition ${
                    toggleOn
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setToggleOn(true)}
                >
                  Followers
                </button>
                <button
                  className={`flex-1 py-2 text-center font-medium transition ${
                    !toggleOn
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setToggleOn(false)}
                >
                  Following
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <FollowGrid
                  persons={toggleOn ? followers : following}
                  onFollow={() => {}}
                  onClick={(person) => {
                    setShowFollowModal(false);
                    navigate(`/profile/${person.username}`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
