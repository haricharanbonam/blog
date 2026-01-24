import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/NavBar";
import BlogGrid from "../components/BlogGrid";
import FilterBar from "../components/FilterBar";
import HeroSection from "../components/HeroSection";

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
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

    if (!isSearching) {
        loadBlogs();
    }
  }, [page, isSearching]);


  const handleLoadMore = ()=>
  {
    setPage(prev=>prev+1);
  }
  useEffect(() => {
    if (!isSearching) {
        if (selectedCategory === "All") {
        setFilteredBlogs(blogs);
        } else {
        setFilteredBlogs(
            blogs.filter((blog) => blog.interests?.includes(selectedCategory))
        );
        }
    }
  }, [selectedCategory, blogs, isSearching]);

  const handleSearch = async (query) => {
    if (!query || query.trim() === "") return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setLoadingSearch(true);
    
    try {
        const res = await API.get(`/blog/search?query=${encodeURIComponent(query)}`, {
            withCredentials: true,
        });
        setSearchResults(res.data.data);
    } catch (err) {
        console.error("Search failed:", err);
        // data.data will be empty array on error potentially or handle alert
    } finally {
        setLoadingSearch(false);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    setPage(1); 
    // Resetting page might cause re-fetch due to dependency on page, which is fine to restore default view
  };

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-8">
        
        {isSearching ? (
             <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        Search results: "{searchQuery}"
                    </h2>
                    <button 
                        onClick={clearSearch}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                        title="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {loadingSearch ? (
                     <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-slate-500">Searching...</p>
                     </div>
                ) : searchResults.length > 0 ? (
                    <BlogGrid blogs={searchResults} onBlogClick={handleBlogClick} />
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        No blogs found matching "{searchQuery}"
                    </div>
                )}
             </div>
        ) : (
            <>
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
            </>
        )}
      </div>
    </>
  );
};

export default Blog;
