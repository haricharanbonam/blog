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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <div className="container mx-auto px-4 py-12">
        
        {isSearching ? (
             <div className="mb-12">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        Search results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">"{searchQuery}"</span>
                    </h2>
                    <button 
                        onClick={clearSearch}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
                        title="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {loadingSearch ? (
                     <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                        <p className="mt-4 text-slate-400">Searching the universe...</p>
                     </div>
                ) : searchResults.length > 0 ? (
                    <BlogGrid blogs={searchResults} onBlogClick={handleBlogClick} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl text-slate-500 mb-2">No stories found matching "{searchQuery}"</p>
                        <p className="text-slate-600">Try searching for a different topic or keyword.</p>
                    </div>
                )}
             </div>
        ) : (
            <div className="space-y-12">
                {/* Optional: Section Header for "Latest Posts" or similar if needed */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <h2 className="text-3xl font-bold text-white">Latest Stories</h2>
                   <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />
                </div>
                
                <BlogGrid blogs={filteredBlogs} onBlogClick={handleBlogClick} />

                <div className="w-full flex justify-center pt-8">
                {hasMore && (
                    <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-full shadow-lg shadow-purple-900/20 hover:scale-105 hover:shadow-purple-900/40 transition-all duration-300"
                    >
                    Explore More
                    </button>
                )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
