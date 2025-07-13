import {
  addComment,
  createBlog,
  getBlogsonInterest,
  handleSave,
  myBlogs,
  toggleDislike,
  toggleLike,
  viewBlog,
} from "../controllers/blog.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkProfileCompletion } from "../middlewares/checkProfileComplete.js";
import { upload } from "../middlewares/multer.js";
const blogRouter = Router();
blogRouter.post("/create", upload.single("coverImage"), verifyJWT, createBlog);
blogRouter.post(`/:page`, verifyJWT, checkProfileCompletion, getBlogsonInterest);
blogRouter.put("/like/:id", verifyJWT, toggleLike);
blogRouter.post("/comment/:id", verifyJWT, addComment);
blogRouter.get("/view/:id", verifyJWT, viewBlog);
blogRouter.put("/dislike/:id", verifyJWT, toggleDislike);
blogRouter.put("/dislike/:id", verifyJWT, toggleDislike);
blogRouter.get("/myblogs", verifyJWT, myBlogs);
blogRouter.post("/save/:id", verifyJWT, handleSave);
export default blogRouter;
