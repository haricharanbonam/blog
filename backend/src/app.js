import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { Blog } from "./models/Blog.model.js";
import { User } from "./models/User.model.js";
import { ApiError } from "./utils/ApiError.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

// app.use() //used for middleware and conifgurations
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-alpha-smoky-31.vercel.app",
    ],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use("/", (req, res, next) => {
  console.log(req.method + req.url);
  next();
});

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
// const update=async()=>
// {
//   const blogs = await Blog.find();
//   for (const blog of blogs) {
//     await User.findByIdAndUpdate(
//     blog.author,
//     { $addToSet: { myPosts: blog._id } } // avoids duplicates
//   );
// }
// }
// update();

app.use(express.static("public"));

app.use(cookieParser());

app.use("/user", userRouter);

app.use("/blog", blogRouter);

app.all("/", () => {
  console.log("check u r routes pal");
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };
