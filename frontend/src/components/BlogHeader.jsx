import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const BlogHeader = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {blog.title}
      </h1>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate(`/profile/${blog.author.username}`)}
      >
        <div className="bg-indigo-100 dark:bg-indigo-900 h-12 w-12 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-xl">
          {blog.author.fullName.charAt(0).toUpperCase()}
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
