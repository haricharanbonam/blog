import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";
import MarkdownRenderer from "../utils/MarkDownRenderer";
const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blog/view/${id}`, {
          withCredentials: true,
        });
        setBlog(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    try {
      const res = await API.post(
        `/blog/comment/${id}`,
        { content: comment },
        { withCredentials: true }
      );
      setBlog((prev) => ({
        ...prev,
        comments: [...(prev?.comments || []), res.data.data],
      }));

      setComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };
  const handleLike = async () => {
    try {
      const res = await API.put(
        `/blog/like/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setBlog((prev) => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        likesCount: prev.likedByCurrentUser
          ? prev.likesCount - 1
          : prev.likesCount + 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to like blog");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading blog...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!blog) return <div className="text-center mt-10">Blog not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-indigo-600 dark:text-indigo-400 mb-6 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to blogs
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center">
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

        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt="cover"
            className="w-full h-64 object-cover"
          />
        )}

        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownRenderer content={blog.content} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {blog.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
              >
                #{interest}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <button
              className={`flex items-center space-x-1 
    ${
      blog.likedByCurrentUser
        ? "text-red-500"
        : "text-gray-600 dark:text-gray-400"
    }
    hover:text-red-500 dark:hover:text-red-400
  `}
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

            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
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
            </button>
          </div>
        </div>

        {/* Comments */}
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
                  <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                    {comment?.author?.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 dark:text-white">
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
      </article>
    </div>
  );
};

export default ViewBlog;
