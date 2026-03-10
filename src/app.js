import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
/*Why limit 16kb?

Security.

If someone sends 50MB data, server can crash 💀
So we limit it.*/
app.use(express.json({ limit: "16kb" }));
//reads json data from frontend without it :req.body  // ❌ undefined
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//takes html form data; extended true → allows nested objects false → only simple key-value
app.use(express.static("public"));
//if someone request a file , look in the public folder
app.use(cookieParser());
//without it, cant get req.cookies...cookies normally have token which used for login authentication and JWT

//routes import
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

//routes declaration
// '/' is used for regular web pages(html,css,js)  '/api' is a special entrance just for apps to talk to server ..frontend apps mobile apps Server responds with data JSON  not HTML pages

// '/v1' is versioning like suppose if we have GET /api/v1/users it returns user info in format A
//Later you want to change the format or add some new fields GET /api/v2/users
//Old apps still need format A → /v1/users keeps working
//New apps can use format B → /v2/users

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/users/register

export { app };
