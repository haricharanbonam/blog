import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/Blog.model.js";
import { User } from "../models/User.model.js";
import { Comment } from "../models/Comment.model.js";
const createBlog = asyncHandler(async (req, res) => {
  const { content, interests } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }
  if (interests.length <= 0) {
    throw new ApiError(400, "interests is required");
  }
  const blog = await Blog.create({
    content: content.trim(),
    author: req.user._id,
    likes: 0,
    comments: [],
    interests,
  });
  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

const getBlogsonInterest = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    interests: { $in: req.user.interests },
    
  }).populate("author","fullName");

  if (!blogs) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs fetched by interest"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const user = await User.findById(userId);
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (!user) return res.status(404).json({ message: "Blog not found" });
  blog.likes = blog.likes || [];
  blog.dislikes = blog.dislikes || [];
  const hasLiked = blog.likes.includes(userId);
  const hasDisliked = blog.dislikes.includes(userId);
  console.log("it made this fqar 1");
  if (hasLiked) {
    blog.likes.pull(userId);
    user.likedPosts.pull(id);
  } else {
    console.log("it made this fqar 2");
    blog.likes.push(userId);
    if (!user.likedPosts.includes(id)) {
      user.likedPosts.push(id);
    }
    if (hasDisliked) blog.dislikes.pull(userId);
  }

  await blog.save();
  await user.save();

  res.json({
    message: hasLiked ? "Like removed" : "Blog liked",
    likesCount: blog.likes.length,
    dislikesCount: blog.dislikes.length,
  });
});

const toggleDislike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const hasDisliked = blog.dislikes.includes(userId);
  const hasLiked = blog.likes.includes(userId);

  if (hasDisliked) {
    blog.dislikes.pull(userId);
  } else {
    blog.dislikes.push(userId);
    if (hasLiked) blog.likes.pull(userId);
  }

  await blog.save();

  res.json({
    message: hasDisliked ? "Dislike removed" : "Blog disliked",
    likesCount: blog.likes.length,
    dislikesCount: blog.dislikes.length,
  });
});

const addComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const user = await User.findById(userId);
  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const comment = await Comment.create({
    user: userId,
    content,
  });

  blog.comments.push(comment._id);

  if (!user.commentedPosts.includes(id)) {
    user.commentedPosts.push(id);
  }

  await blog.save();
  await user.save();

  await blog.populate({
    path: "comments",
    populate: {
      path: "user",
      select: "username fullName",
    },
  });

  res.status(201).json({
    message: "Comment added successfully",
    comments: blog.comments,
  });
});

const viewBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id)
    .populate({
      path: "author",
      select: "fullName username", // blog author's name
    })
    .populate({
      path: "comments",
      populate: {
        path: "user", // 🔥 fix here: it's 'user', not 'author'
        select: "fullName username", // comment author's name
      },
    });

  if (!blog) {
    throw new ApiError(404, "The blog does not exist");
  }

  const formattedBlog = {
    _id: blog._id,
    content: blog.content,
    author: blog.author, // blog author's name
    likesCount: blog.likes.length,
    dislikesCount: blog.dislikes.length,
    interests: blog.interests,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    comments: blog.comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      author: comment.user, // comment author's name here
      createdAt: comment.createdAt,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, formattedBlog, "Blog fetched successfully"));
});

export {
  createBlog,
  getBlogsonInterest,
  toggleDislike,
  toggleLike,
  addComment,
  viewBlog,
};
