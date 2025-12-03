import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const CommentSection = ({
  blog,
  comment,
  setComment,
  commentLoading,
  handleCommentSubmit,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Comments ({blog.comments.length})
      </h3>
      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
            disabled={commentLoading}
          >
            {commentLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {blog.comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          blog.comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">


              <div
                onClick={() =>
                  navigate(`/profile/${comment?.author?.username}`)
                }
                className="h-12 w-12 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-xl"
              >
                {comment.author?.avatarUrl ? (
                  <img
                    src={comment.author.avatarUrl}
                    alt={comment.author.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                    comment?.author?.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4
                      className="font-semibold text-gray-800 dark:text-white cursor-pointer"
                      onClick={() =>
                        navigate(`/profile/${comment?.author?.username}`)
                      }
                    >
                      {comment?.author?.fullName}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
