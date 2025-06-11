import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";

const Blog = ({ isAuthenticated }) => {
  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.post("/blog", {
          withCredentials: true,
        });
        setBlogs(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
        Blogs Based on Your Interests
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No blogs found based on your interests.
        </p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleBlogClick(blog._id)}
          >
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 h-10 w-10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                {blog.author.fullName.charAt(0)}
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {blog.author.fullName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {blog.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;
