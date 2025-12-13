import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Blog } from "../models/Blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { cloudUpload } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { options } from "../constants.js";
import { Follow } from "../models/Follow.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/SendEmail.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateUsername } from "../constants.js";
import axios from "axios"

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
    // i dont want to change the refresh i want the user to be logged out after a  certain time ok ?

  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    // const refreshToken = user.generateRefreshToken();
    // user.refreshToken = refreshToken;
    // await user.save({ validateBeforeSave: false });
    // return { accessToken, refreshToken };
    // i dont want to change the refresh i want the user to be logged out after a  certain time ok ?
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
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
  sendEmail(
    createdUser.email,
    "Welcome to Our Platform",
    `Hello ${createdUser.fullName},
    \n\nThank you for registering on our platform. We are excited to have you with us!\n\nBest regards,\nThe Team
    To verify your email, please click on the link below:\n\n
    <a href="${process.env.FRONTEND_URL}/verify-email?token=${createdUser._id}">Verify Email</a>
    \n\nIf you did not register, please ignore this email.
    `
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
  if (!email && !username) {
    throw new ApiError(400, "username or email is required");
  }
  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // ✅ FIX: Check if user exists FIRST
  if (!findUser) {
    throw new ApiError(404, "User does not exist");
  }

  // ✅ NOW check if Google user
  if (findUser.isGoogleUser) {
    throw new ApiError(400, "User can only login through Google");
  }

  const isPasswordValid = await findUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshTokens(findUser._id);

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

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
        lastLogin: new Date(),
      },
    },
    {
      new: true, // to return the new object to logoutUser
    }
  );
  console.log("the cookies we got", req.cookies);
  res
    .clearCookie("accessToken", { ...options, expires: new Date(0) })
    .clearCookie("refreshToken", { ...options, expires: new Date(0) })
    .status(200)
    .json(new ApiResponse(200, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log("all cookies are ", req.cookies);
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  console.log("the token that came ", incomingRefreshToken);
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken } = await generateAccessToken(user._id);
    console.log("upto here so fine");
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
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
  const { interests, aboutme, Profession } = req.body;
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
      aboutme,
      Profession,
      isProfileCompleted: true,
    },
    { new: true } // returns the updated document
  );

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.status(200).json({ message: "Profile completed", user });
});
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "blogs",
        let: { postIds: { $ifNull: ["$myPosts", []] } },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$postIds"] },
            },
          },
          {
            $project: {
              title: 1,
              coverImage: 1,
            },
          },
        ],
        as: "myPosts",
      },
    },
    {
      $lookup: {
        from: "blogs",
        let: { liked: { $ifNull: ["$likedPosts", []] } },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$liked"] },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $project: {
              title: 1,
              coverImage: 1,
              author_fullName: { $arrayElemAt: ["$author.fullName", 0] },
            },
          },
        ],
        as: "likedPosts",
      },
    },
    {
      $lookup: {
        from: "blogs",
        let: { saved: { $ifNull: ["$savedPosts", []] } },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$_id", "$$saved"] },
            },
          },
          {
            $project: {
              title: 1,
              coverImage: 1,
            },
          },
        ],
        as: "savedPosts",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "person",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
      },
    },
    {
      $project: {
        fullName: 1,
        aboutme: 1,
        Profession: 1,
        avatarUrl: 1,
        username: 1,
        email: 1,
        myPosts: 1,
        likedPosts: 1,
        savedPosts: 1,
        followers: 1,
        following: 1,
      },
    },
  ]);

  if (!user[0]) {
    return res.status(404).json({ message: "User not found" });
  }

  const isOwner = req.user._id.toString() === user[0]._id.toString();

  let isFollowing = false;
  if (!isOwner) {
    isFollowing = user[0].followers
      .map((f) => f.follower.toString())
      .includes(req.user._id.toString());
  }

  res.status(200).json({
    ...user[0],
    owner: isOwner,
    isFollowing: isFollowing || false,
  });
});

const updateDetails = asyncHandler(async (req, res) => {
  const { fullName, aboutme, Profession } = req.body;
  const userId = req.user.id;
  if (!fullName || !aboutme || !Profession) {
    return res.status(400).json({
      message: "Full name, about me, and profession are required.",
    });
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      aboutme,
      Profession,
    },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const uploadResult = await cloudUpload(file.path); // Your Cloudinary uploader

  if (!uploadResult || !uploadResult.secure_url) {
    return res.status(500).json({ message: "File upload failed" });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { avatarUrl: uploadResult.secure_url },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res
    .status(200)
    .json(new ApiResponse(200, user.avatarUrl, "Avatar updated successfully"));
});

const followOrUnfollowUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.user._id;
  const targetUser = await User.findOne({ username });
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }
  if (targetUser._id.equals(currentUserId)) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }
  const existingFollow = await Follow.findOne({
    follower: currentUserId,
    person: targetUser._id,
  });

  if (existingFollow) {
    await Follow.deleteOne({ _id: existingFollow._id });

    return res.status(200).json({
      message: "Unfollowed",
      followerId: currentUserId.toString(),
    });
  } else {
    await Follow.create({
      follower: currentUserId,
      person: targetUser._id,
    });

    const followerUser = await User.findById(currentUserId).select("fullName");

    return res.status(200).json({
      message: "Followed",
      follower: {
        _id: currentUserId,
        fullName: followerUser.fullName,
      },
    });
  }
});

const getFollowersandFollowing = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    "_id"
  );
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const owner = req.user._id.toString();
  const followers = await Follow.find({ person: user._id })
    .populate("follower", "fullName username avatarUrl")
    .select("follower")
    .lean();

  const following = await Follow.find({ follower: user._id })
    .populate("person", "fullName username avatarUrl")
    .select("person")
    .lean();

  const followersWithFlag = await Promise.all(
    followers.map(async (f) => {
      const isFollowing = await Follow.exists({
        person: f.follower._id,
        follower: owner,
      });
      return {
        ...f,
        isFollowing: !!isFollowing,
      };
    })
  );

  const followingWithFlag = await Promise.all(
    following.map(async (f) => {
      const isFollower = await Follow.exists({
        person: owner,
        follower: f.person._id,
      });
      return {
        ...f,
        isFollower: !!isFollower,
      };
    })
  );

  const flattenedFollowers = followersWithFlag.map((f) => ({
    _id: f._id,
    fullName: f.follower.fullName,
    username: f.follower.username,
    avatarUrl: f.follower.avatarUrl,
    isFollowing: f.isFollowing,
  }));

  const flattenedFollowing = followingWithFlag.map((f) => ({
    _id: f._id,
    fullName: f.person.fullName,
    username: f.person.username,
    avatarUrl: f.person.avatarUrl,
    isFollower: f.isFollower,
  }));

  res.json({
    followers: flattenedFollowers,
    following: flattenedFollowing,
  });
});

const getNotifications = asyncHandler(async (req, res) => {
  const Follows = await Follow.find({ follower: req.user._id });
  const followedUserIds = Follows.map((e) => e.person);
  const user = await User.findById(req.user._id);
  const lastLoginTime = user.lastLogin || new Date(0);
  const newPosts = await Blog.find({
    author: { $in: followedUserIds },
    createdAt: { $gt: lastLoginTime },
  })
    .populate("author", "fullName")
    .sort({ createdAt: -1 })
    .limit(10);

  res
    .status(200)
    .json(new ApiResponse(200, newPosts, "New posts from followed users"));
});
const checkUser = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken || req.body?.accessToken;
  if (!token) {
    throw new ApiError(401, "No Access Token Provided");
  }
  try {
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedUser?._id).select(
      "avatarUrl username"
    );
    if (!user) {
      throw new ApiError(401, "INvalid Token");
    }
    res.status(200).json(user);
  } catch (err) {
    throw new ApiError(401, "token is expired");
  }
});


const registerWithGoogle = asyncHandler(async (req, res) => {
  const { code, redirectUri } = req.body;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  console.log("made it to the top");
  if (!code) {
    console.error("❌ Missing authorization code");
    return res
      .status(400)
      .json({ success: false, message: "Authorization code is missing" });
  }

  try {
    const finalRedirect = redirectUri;

    let tokenResponse;
    try {
      tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: finalRedirect,
        grant_type: "authorization_code",
      });
    } catch (tokenErr) {
      console.error(
        "🔴 Token Exchange Failed:",
        tokenErr.response?.data || tokenErr.message
      );
      return res.status(400).json({
        success: false,
        message:
          tokenErr.response?.data?.error_description ||
          "Token exchange failed.",
      });
    }

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No access token received from Google",
        });
    }

    let googleUser;

    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      googleUser = userInfoResponse.data;
    } catch (userErr) {
      console.error(
        "🔴 Failed to fetch Google user info:",
        userErr.response?.data || userErr.message
      );
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch Google user info" });
    }
console.log("fetched google user",googleUser);
    const { email, name, picture } = googleUser || {};

    const check = await User.findOne({ email });

    if (check) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email already exists"));
    }

    const newUser = new User({
      isGoogleUser: true,
      fullName: name,
      email,
      password: "",
      username: generateUsername(name),
      avatarUrl: picture || "",
    });

    await newUser.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User registered successfully"));
  } catch (error) {
    console.error("🔴 Registration Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});


const loginWithGoogle = asyncHandler(async (req, res) => {
  const { code, redirectUri } = req.body;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  console.log("made it to the top of google login");

  if (!code) {
    throw new ApiError(400, "Authorization code is missing");
  }

  try {
    const finalRedirect = redirectUri;

    let tokenResponse;
    try {
      tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: finalRedirect,
        grant_type: "authorization_code",
      });
    } catch (tokenErr) {
      console.error(
        "🔴 Token Exchange Failed:",
        tokenErr.response?.data || tokenErr.message
      );
      throw new ApiError(
        400,
        tokenErr.response?.data?.error_description || "Token exchange failed."
      );
    }

    const { access_token } = tokenResponse.data;
    if (!access_token) {
      throw new ApiError(400, "No access token received from Google");
    }

    let googleUser;

    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      googleUser = userInfoResponse.data;
    } catch (userErr) {
      console.error(
        "🔴 Failed to fetch Google user info:",
        userErr.response?.data || userErr.message
      );
      throw new ApiError(500, "Failed to fetch Google user info");
    }

    console.log("fetched google user", googleUser);
    const { email } = googleUser || {};

    // ✅ Check if user exists
    const findUser = await User.findOne({ email });

    if (!findUser) {
      throw new ApiError(404, "User does not exist. Please sign up first.");
    }

    // ✅ Check if user registered with Google
    if (!findUser.isGoogleUser) {
      throw new ApiError(
        400,
        "This email is registered with password. Please use regular login."
      );
    }

    // ✅ Use the same helper function as normal login
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshTokens(findUser._id);

    const loggedInUser = await User.findById(findUser._id).select(
      "-password -refreshToken"
    );

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
  } catch (error) {
    // ✅ If it's already an ApiError, throw it as is
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("🔴 Login Error:", error);
    throw new ApiError(500, "Internal server error");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  setInterests,
  createBlog,
  getUserProfile,
  updateDetails,
  updateUserAvatar,
  followOrUnfollowUser,
  getFollowersandFollowing,
  getNotifications,
  checkUser,
  registerWithGoogle,
  loginWithGoogle
};
