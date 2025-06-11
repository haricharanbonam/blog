import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  // console.log("username ", username);
  if (
    [fullName, email, username, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email / username already exists");
  }

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Succesfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, password);
  if (!email && !username) {
    throw new ApiError(400, "username or email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!findUser) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await findUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate tokens and refreshToken is saved inside the function already
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshTokens(findUser._id);

  // No need to save refreshToken here again, as it's done inside generateAccessTokenAndRefreshTokens

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "login success"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // to return the new object to logoutUser
    }
  );
  const options = {
    httpOnly: true,
    secure: true, //
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    const { accessToken, newrefreshToken } =
      generateAccessTokenAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true, //
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    console.error("Refresh error:", error.message);
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired");
    }

    throw new ApiError(500, "Something went wrong while refreshing token");
  }
});

const createBlog = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }
  const blog = await Blog.create({
    content: content.trim(),
    author: req.user._id,
    likes: 0,
    comments: [],
  });
  res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

const setInterests = asyncHandler(async (req, res) => {
  const { interests } = req.body;
  const userId = req.user.id;

  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({
      message: "Interests are required and must be a non-empty array.",
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      interests,
      isProfileCompleted: true,
    },
    { new: true } // returns the updated document
  );

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ message: "Profile completed", user });
});

const getUserProfile = asyncHandler(async (req, res) => {
  console.log(req.user);
  const userId = req.user.id;

  const user = await User.findById(userId)
    .select("-password -refreshToken") // Exclude sensitive fields
    .populate({
      path: "likedPosts",
      select: "content", // Only blog content
    })
    .populate({
      path: "commentedPosts",
      select: "content", // Only blog content
    });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  setInterests,
  createBlog,
  getUserProfile,
};
