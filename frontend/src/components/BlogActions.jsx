import React from "react";
const BlogActions = ({ blog, handleLike }) => {
  return (
    <div className="px-6 pb-6 mt-2 flex items-center space-x-4">
      <button
        className={`flex items-center space-x-1 ${
          blog.likedByCurrentUser
            ? "text-red-500"
            : "text-gray-600 dark:text-gray-400"
        } hover:text-red-500 dark:hover:text-red-400`}
        onClick={handleLike}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{blog.likesCount}</span>
      </button>

      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clipRule="evenodd"
          />
        </svg>
        <span>{blog.comments.length}</span>
      </div>
    </div>
  );
};

export default BlogActions;
