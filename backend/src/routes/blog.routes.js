import {
  addComment,
  createBlog,
  getBlogsonInterest,
  toggleDislike,
  toggleLike,
  viewBlog,
} from "../controllers/blog.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkProfileCompletion } from "../middlewares/checkProfileComplete.js";
const blogRouter = Router();
blogRouter.post("/create", verifyJWT, createBlog);
blogRouter.post("/", verifyJWT, checkProfileCompletion, getBlogsonInterest);
blogRouter.put("/like/:id", verifyJWT, toggleLike);
blogRouter.put("/dislike/:id", verifyJWT, toggleDislike);
blogRouter.post("/comment/:id", verifyJWT, addComment);
blogRouter.get("/view/:id", viewBlog);
export default blogRouter;
 