import mongoose from "mongoose";
const blogSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: true,
      default: "https://via.placeholder.com/150",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    interests: {
      type: [String],
      required: true,
      enum: [
        "Technology",
        "Health",
        "Lifestyle",
        "Education",
        "Travel",
        "Food",
        "Finance",
        "Entertainment",
        "Sports",
        "Other",
        "JavaScript",
        "Python",
        "Java",
        "Backend",
        "SQL",
        "DSA",
      ],
    },
  },
  { timestamps: true }
);

blogSchema.index({ createdAt: -1 });
export const Blog = mongoose.model("Blog", blogSchema);
