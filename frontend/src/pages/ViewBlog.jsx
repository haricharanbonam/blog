import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import moment from "moment";
import MarkdownRenderer from "../utils/MarkDownRenderer";
import BlogHeader from "../components/BlogHeader";
import BlogCoverImage from "../components/BlogCoverImage";
import BlogContent from "../components/BlogContent";
import BlogTags from "../components/BlogTags";
import BlogActions from "../components/BlogActions";
import CommentSection from "../components/CommentSection";

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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
      await API.put(
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
        <BlogHeader blog={blog} />
        <BlogCoverImage coverImage={blog.coverImage} />
        <BlogContent content={blog.content} />
        <BlogTags interests={blog.interests} />
        <BlogActions blog={blog} handleLike={handleLike} />
        <CommentSection
          blog={blog}
          comment={comment}
          setComment={setComment}
          commentLoading={commentLoading}
          handleCommentSubmit={handleCommentSubmit}
        />
      </article>
    </div>
  );
};

export default ViewBlog;
