import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/Blog.model.js";
import { User } from "../models/User.model.js";
import { Follow } from "../models/Follow.model.js";
import { Comment } from "../models/Comment.model.js";
import { upload } from "../middlewares/multer.js";
import { cloudUpload } from "../utils/cloudinary.js";
const createBlog = asyncHandler(async (req, res) => {
  const { content, interests, title } = req.body;
  if (!content || typeof content !== "string" || content.trim() === "") { //best way to check if the given string is proper or not
    throw new ApiError(400, "Content is required");
  }
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new ApiError(400, "Title is required");
  }
  let interestArray = interests;
  if (typeof interests === "string") {
    try {
      interestArray = JSON.parse(interests);
    } catch {
      interestArray = interests.split(",").map((item) => item.trim());
    }
  }

  if (!Array.isArray(interestArray) || interestArray.length === 0) { //for an array
    throw new ApiError(400, "At least one interest is required");
  }

  const coverImageUrl = req.file
    ? req.file.path
    : "https://via.placeholder.com/150";

  const uploadImageUrl = await cloudUpload(coverImageUrl);
  if (!uploadImageUrl) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const blog = await Blog.create({
    content: content.trim(),
    title: title.trim(),
    coverImage: uploadImageUrl.url,
    author: req.user._id,
    comments: [],
    interests: interestArray,
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: { myPosts: blog._id },
  });

  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

const getBlogsonInterest = asyncHandler(async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;
  const blogs = await Blog.find({})
    .populate("author", "fullName")
    .skip(skip)
    .limit(limit);

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
  if (hasLiked) {
    blog.likes.pull(userId);
    user.likedPosts.pull(id);
  } else {
    blog.likes.push(userId);
    if (!user.likedPosts.includes(id)) {
      user.likedPosts.push(id);
    }
  }
  await blog.save();
  await user.save();
  res.json({
    message: hasLiked ? "Like removed" : "Blog liked",
    likesCount: blog.likes.length,
    dislikesCount: blog.dislikes.length,
  });
});

// const toggleDislike = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { id } = req.params;

//   const blog = await Blog.findById(id);
//   if (!blog) return res.status(404).json({ message: "Blog not found" });

//   const hasDisliked = blog.dislikes.includes(userId);
//   const hasLiked = blog.likes.includes(userId);

//   if (hasDisliked) {
//     blog.dislikes.pull(userId);
//   } else {
//     blog.dislikes.push(userId);
//     if (hasLiked) blog.likes.pull(userId);
//   }

//   await blog.save();

//   res.json({
//     message: hasDisliked ? "Dislike removed" : "Blog disliked",
//     likesCount: blog.likes.length,
//     dislikesCount: blog.dislikes.length,
//   });
// });
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

  let comment = await Comment.create({
    user: userId,
    content,
  });

  blog.comments.push(comment._id);
  if (!user.commentedPosts.includes(id)) {
    user.commentedPosts.push(id);
  }

  await blog.save();
  await user.save();

  // 🛠️ Populate the comment's user details before sending it back
  comment = await comment.populate("user", "username fullName");

  res.status(201).json({
    message: "Comment added successfully",
    data: {
      _id: comment._id,
      content: comment.content,
      author: {
        fullName: comment.user.fullName,
        username: comment.user.username,
      },
      createdAt: comment.createdAt,
    },
  });
});

const viewBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id; 

  const blog = await Blog.findById(id)
    .populate({
      path: "author",
      select: "fullName username avatarUrl",
    })
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "fullName username avatarUrl",
      },
    });

  if (!blog) {
    throw new ApiError(404, "The blog does not exist");
  }

  const likedByCurrentUser = blog.likes.includes(currentUserId);
  const saved = req.user.savedPosts.includes(blog._id);

  const formattedBlog = {
    _id: blog._id,
    title: blog.title,
    coverImage: blog.coverImage,
    content: blog.content,
    author: blog.author,
    likesCount: blog.likes.length,
    interests: blog.interests,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    isSaved: saved,
    likedByCurrentUser, // ✅ Added
    comments: blog.comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      author: {
        fullName: comment.user.fullName,
        username: comment.user.username,
        avatarUrl:comment.user.avatarUrl
      },
      createdAt: comment.createdAt,
    })),
  };
console.log("the thing we are gonna send is",formattedBlog.comments);
  return res
    .status(200)
    .json(new ApiResponse(200, formattedBlog, "Blog fetched successfully"));
});

const myBlogs = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user's blogs" });
  }
});

const handleSave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const alreadySaved = user.savedPosts.includes(id);

  if (alreadySaved) {
    user.savedPosts = user.savedPosts.filter(
      (postId) => postId.toString() !== id
    );
  } else {
    user.savedPosts.push(id);
  }

  await user.save();

  return res.status(200).json({
    message: alreadySaved ? "Post unsaved" : "Post saved",
    saved: !alreadySaved,
  });
});

export {
  createBlog,
  getBlogsonInterest,
  // toggleDislike,
  toggleLike,
  addComment,
  viewBlog,
  myBlogs,
  handleSave,
};
