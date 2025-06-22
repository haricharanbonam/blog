const BlogContainer = ({ blog, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick(blog._id)}
    >
      <img
        src={blog.coverImage}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Likes: {blog.likes?.length || 0}
          </span>
          <div className="flex flex-wrap gap-1">
            {blog.interests?.map((interest, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContainer;
