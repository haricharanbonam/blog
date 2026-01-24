import React, { useState } from "react";
import { FaSearch, FaArrowDown } from "react-icons/fa";

const HeroSection = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />

      {/* Content Container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
          <span className="text-xs font-medium text-purple-300 tracking-wider uppercase">
            Welcome to the future
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight leading-tight">
          Discover stories that <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            ignite your mind.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore a universe of thinking, expertise, and tales from writers onto
          any topic. Your daily dose of inspiration starts here.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto w-full group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div className="relative flex items-center bg-[#1a1a1a] rounded-full border border-white/10 shadow-2xl overflow-hidden">
            <div className="pl-6 text-slate-500">
              <FaSearch />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white placeholder-slate-500 px-4 py-4 focus:outline-none"
              placeholder="Search for articles, topics, or writers..."
            />
            <button 
              onClick={handleSearch}
              className="bg-white text-black px-6 py-2 m-2 rounded-full font-semibold hover:bg-slate-200 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        onClick={handleScrollDown}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce text-slate-500 hover:text-white transition-colors"
      >
        <FaArrowDown size={24} />
      </div>

      {/* Custom Keyframes for fade-in (can be added to global css or via tailwind config, 
          using inline style/className for standard Tailwind usually acts immediately if configured, 
          but here assuming standard utility usage or simple defaults) */}
    </div>
  );
};

export default HeroSection;
