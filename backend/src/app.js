import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
 
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import followRouter from "./routes/follow.routes.js";
import commentRouter from "./routes/comment.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/comments", commentRouter);

export { app }