import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/NavBar";
import BlogGrid from "../components/BlogGrid";
import FilterBar from "../components/FilterBar";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await API.post(`/blog/${page}`, {
          withCredentials: true,
        });
        if(res.data.data.length==0)
        {
          setHasMore(false);
        }
        setBlogs((prev) => [...prev, ...res.data.data]);
        
        setFilteredBlogs(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [page]);


  const handleLoadMore = ()=>
  {
    setPage(prev=>prev+1);
  }
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(
        blogs.filter((blog) => blog.interests?.includes(selectedCategory))
      );

    }
  }, [selectedCategory, blogs]);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
        <BlogGrid blogs={filteredBlogs} onBlogClick={handleBlogClick} />

        <div className="w-full flex justify-center mt-10">
          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold text-lg rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              🚀 Load More Blogs
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
