const BlogContainer = ({ blog, onClick }) => {
  return (
    <div
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-white/5"
      onClick={() => onClick(blog._id)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        <img
          src={blog.coverImage || "https://images.unsplash.com/photo-1499750310159-52f0f834631b"} // Fallback image if needed
          alt={blog.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge on Image */}
        <div className="absolute top-4 left-4 z-20">
            {blog.interests?.[0] && (
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-semibold text-purple-300 rounded-full border border-white/10">
                {blog.interests[0]}
            </span>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors leading-tight">
          {blog.title}
        </h2>
        
        {/* Tags/Footer */}
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
           <div className="flex gap-2">
            {blog.interests?.slice(0, 2).map((interest, i) => (
                <span
                key={i}
                className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5"
                >
                #{interest}
                </span>
            ))}
            {blog.interests?.length > 2 && (
                <span className="text-xs font-medium text-slate-500 py-1">
                    +{blog.interests.length - 2}
                </span>
            )}
           </div>
           
           {/* Simple Read More / Arrow */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;
