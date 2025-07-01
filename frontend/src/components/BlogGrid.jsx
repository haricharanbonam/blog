// components/BlogGrid.jsx
import BlogContainer from "./BlogContainer";

const BlogGrid = ({ blogs, onBlogClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {}
      {blogs.map((blog) => (
        <BlogContainer key={blog._id} blog={blog} onClick={onBlogClick} />
      ))}
    </div>
  );
};

export default BlogGrid;
