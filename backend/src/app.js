import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { Blog } from "./models/Blog.model.js";
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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  express.json({
    //we can configure it to accept the json from the express
    limit: "16kb",
  })
);

app.use("/", (req, res, next) => {
  console.log(req.url);
  next();
});

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

app.use("/user", userRouter);

app.use("/blog", blogRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };
