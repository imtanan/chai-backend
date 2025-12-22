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

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//import routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);
export { app };

/*
Information:
express.use()

👉 Means: “Use this helper for every request.”

🧠 Why world uses it?

So we don’t repeat code

Same rule applies to all routes

Example:

Every request → pass through security gate
*/

/*
cors

👉 Means: “Allow frontend to talk to backend.”

🧠 Why world uses it?

Browser blocks requests by default

Frontend (React) ≠ Backend (API)

Without CORS → ❌ request blocked

Think:

Frontend knocking door
CORS says: “Yes, you are allowed”
*/
