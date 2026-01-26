import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
/*colon here means that here in the URL any value can be fit in place of videoId like if videoId is 123 then url will be like https/www.blabla.com/123...*/
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
