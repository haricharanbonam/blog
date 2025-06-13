import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get(`/user/profile/${username}`);
        setUserData(res.data);
      } catch (error) {
        navigate("/notfound")
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{userData.fullName}</h1>
        <p className="text-gray-600">@{userData.username}</p>
        <p className="mt-4 text-gray-700">
          <strong>About Me:</strong> {userData.aboutme || "Not provided"}
        </p>
        <p className="text-gray-700">
          <strong>Profession:</strong> {userData.Profession || "Not provided"}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Liked Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {userData.likedPosts.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleBlogClick(blog._id)}
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
              <p className="text-gray-600">By {blog.author.fullName}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData.myPosts.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleBlogClick(blog._id)}
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
