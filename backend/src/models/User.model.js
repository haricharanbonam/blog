import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    isGoogleUser:
    {
      type:Boolean,
      default:false
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    interests: {
      type: [String],
      default: [],
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    commentedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    myPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    aboutme: {
      type: String,
      default: "",
    },
    Profession: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  console.log(this.password);
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  console.log(password);
  return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
  console.log(process.env.ACCESS_TOKEN_SECRET || "didnt load");
  console.log(process.env.ACCESS_TOKEN_EXPIRY || "didnt load expiry");
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
