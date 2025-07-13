import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { useRef } from "react";
import { uploadFile } from "../utils/uploadFile";
import Popup from "../utils/Popup";
import BlogGrid from "../components/BlogGrid";
const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showpopup, setShowPopup] = useState(false);
  const [PopupMessage, setPopupMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(true);
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

        console.log("Fetched user data:", res.data);
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
  }, [username]);

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

    let uploadedUrl = ""; // ✅ Declare it in parent scope

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
      avatarUrl: uploadedUrl, // ✅ Now it's defined
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
        // setShowPopup(true);
        // setPopupMessage(
        //   isFollowing ? "Unfollowed successfully!" : "Followed successfully!"
        // );
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      setShowPopup(true);
      setPopupMessage("Error toggling follow status. Please try again.");
    }
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{userData.fullName}</h1>
          <p className="text-gray-600">@{userData.username}</p>
          <p className="mt-4 text-gray-700">
            <strong>About Me:</strong> {userData.aboutme || "Not provided"}
          </p>
          <p className="text-gray-700">
            <strong>Profession:</strong> {userData.Profession || "Not provided"}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="flex items-center justify-end gap-4 mt-4">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow hover:shadow-md text-sm">
              {userData.followers?.length || 0} Followers
            </button>
            <p> {userData.following?.length || 0} Following</p>

            <button
              onClick={handleFollowToggle}
              className={`px-5 py-2 rounded-full ${
                userData.owner && "invisible"
              } shadow text-sm font-medium transition 
      ${
        isFollowing
          ? "bg-white text-gray-800 border border-gray-400 hover:bg-gray-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
          <p
          className="cursor-pointer "
            onClick={() => {
              navigate(`/followers/${userData.username}`);
            }}
          >
            Click to view
          </p>

          {userData.avatarUrl && (
            <a target="_blank" href={userData.avatarUrl}>
              <img
                src={userData.avatarUrl}
                href={userData.avatarUrl}
                alt="User Avatar"
                className="w-20 h-20 rounded-full cursor-pointer mb-2"
              />
            </a>
          )}
          {!userData.avatarUrl && (
            <div
              className={`w-20 h-20 rounded-full cursor-pointer 
        bg-green-600 text-white
       text-3xl flex items-center justify-center font-bold shadow mb-2`}
            >
              {userData.fullName.charAt(0).toUpperCase()}
            </div>
          )}

          <button
            className={`text-red-600 hover:text-red-800 ${
              userData?.owner === true ? "" : "invisible"
            }  font-semibold cursor-pointer text-lg mt-3`}
            onClick={() => setShowModal(true)}
          >
            Edit
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Liked Posts</h2>
      <BlogGrid blogs={userData.likedPosts} onBlogClick={handleBlogClick} />
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
      <BlogGrid blogs={userData.myPosts} onBlogClick={handleBlogClick} />
      <h2 className="text-2xl font-semibold mb-4">Saved Posts</h2>
      <BlogGrid blogs={userData.savedPosts} onBlogClick={handleBlogClick} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-8">Edit Profile</h2>

            <input
              type="file"
              id="avatar-upload" // 👈 Give it an id
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // 👈 cleaner than inline style
              ref={fileInputRef}
            />
            <label
              htmlFor="avatar-upload" // 👈 Link to the input by id
              className="block text-gray-700 font-semibold mb-1 cursor-pointer hover:text-blue-600 transition"
            >
              Change Avatar
            </label>
            {userData.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt="User Avatar"
                className="w-20 h-20 rounded-full cursor-pointer mb-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-green-600 text-white text-3xl flex items-center justify-center font-bold shadow mb-2">
                {userData.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-lg">Name</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full border p-2 mb-4 rounded"
              defaultValue={userData.fullName}
              onChange={updateInputHandler}
            />
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-1">
                Your Profession
              </label>
              <select
                name="Profession"
                value={newData.Profession || userData.Profession || ""}
                onChange={updateInputHandler}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="" disabled>
                  Select your profession
                </option>
                <option value="Student">Student</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Teacher">Teacher</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <label
              htmlFor="aboutme"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              About Me
            </label>
            <textarea
              name="aboutme"
              id="aboutme"
              rows="4"
              defaultValue={userData.aboutme || ""}
              onChange={updateInputHandler}
              className="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Update your about me section"
            ></textarea>
            <button
              className="bg-green-600 mt-10 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {showpopup && (
        <Popup message={PopupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default Profile;
