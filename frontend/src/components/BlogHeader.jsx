import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../utils/axios";

const BlogHeader = ({ blog }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(blog.isSaved);
  console.log("the thing is ", blog?.author);
  const handleSave = async (blogId) => {
    try {
      setIsSaved((prev) => !prev);
      const response = await API.post(`/blog/save/${blogId}`, {
        saved: !isSaved,
      });
      console.log("Blog saved successfully!", response.data);
    } catch (error) {
      setIsSaved((prev) => !prev);
      console.error(
        "Error saving blog:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {blog.title}
        </h1>

        <button
          className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          onClick={() => handleSave(blog._id)}
          title={isSaved ? "Unsave" : "Save"}
        >
          {isSaved ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
              viewBox="0 0 24 24"
            >
              <path d="M5 3a2 2 0 0 0-2 2v16l9-4 9 4V5a2 2 0 0 0-2-2H5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Author Info */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate(`/profile/${blog.author.username}`)}
      >
        <div className="h-12 w-12 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-xl">
          {blog.author?.avatarUrl ? (
            <img
              src={blog.author.avatarUrl}
              alt={blog.author.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            blog.author?.fullName?.charAt(0)?.toUpperCase()
          )}
        </div>

        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {blog.author.fullName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            @{blog.author.username} · {moment(blog.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
