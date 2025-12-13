import { Router } from "express";
import {
  followOrUnfollowUser,
  getFollowersandFollowing,
  getNotifications,
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  setInterests,
  updateDetails,
  updateUserAvatar,
  checkUser,
  registerWithGoogle,
  loginWithGoogle
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const userRouter = Router();
userRouter.route("/login").post(loginUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/setInterests").post(verifyJWT, setInterests);
userRouter.route("/profile/:username").get(verifyJWT, getUserProfile);
userRouter.route("/update-details").put(verifyJWT, updateDetails);
userRouter.route("/follow/:username").put(verifyJWT, followOrUnfollowUser);
userRouter.route("/notifications").get(verifyJWT, getNotifications);
userRouter.route("/google-register").post(registerWithGoogle);
userRouter.route("/google-login").post(loginWithGoogle);
userRouter.route("/me").get(checkUser);
userRouter
  .route("/followinfo/:username")
  .get(verifyJWT, getFollowersandFollowing);
userRouter
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatar"), updateUserAvatar);

userRouter.route("/check").get(verifyJWT, (req, res) => {
  console.log("entered");
  res.status(200).json({ message: "Authenticated", user: req.user });
});

userRouter.use((req, res) => {
  console.log("❌ User route not found:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: "User route does not exist",
    path: req.originalUrl,
  });
});

export default userRouter;
