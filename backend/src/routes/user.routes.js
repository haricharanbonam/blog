import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  setInterests,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();
userRouter.route("/login").post(loginUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/setInterests").post(verifyJWT, setInterests);
userRouter.route("/profile").get(verifyJWT, getUserProfile);
userRouter.route("/check").get(verifyJWT, (req, res) => {
  console.log("entered");
  res.status(200).json({ message: "Authenticated", user: req.user });
});
export default userRouter;
