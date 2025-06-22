import React from "react";
const BlogTags = ({ interests }) => {
  return (
    <div className="px-6 pb-2 flex flex-wrap gap-2">
      {interests.map((interest, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
        >
          #{interest}
        </span>
      ))}
    </div>
  );
};

export default BlogTags;
