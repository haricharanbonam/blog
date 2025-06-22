import React from "react";

const BlogCoverImage = ({ coverImage }) => {
  if (!coverImage) return null;
  return (
    <img src={coverImage} alt="cover" className="w-full h-64 object-cover" />
  );
};

export default BlogCoverImage;
