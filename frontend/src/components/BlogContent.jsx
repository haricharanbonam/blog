import React from "react";
import MarkdownRenderer from "../utils/MarkDownRenderer";

const BlogContent = ({ content }) => {
  return (
    <div className="p-6">
      <div className="prose dark:prose-invert max-w-none">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
};

export default BlogContent;
