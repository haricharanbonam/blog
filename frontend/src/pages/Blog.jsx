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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.post("/blog", {
          withCredentials: true,
        });
        setBlogs(res.data.data);
        console.log("Blogs fetched:", res.data.data);
        setFilteredBlogs(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

 useEffect(() => {
  if (selectedCategory === "All") {
    setFilteredBlogs(blogs);
  } else {
    setFilteredBlogs(
      blogs.filter((blog) =>
        blog.interests?.includes(selectedCategory)
      )
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
      </div>
    </>
  );
};

export default Blog;
