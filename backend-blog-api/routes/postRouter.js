const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController.js");
const verifyToken = require("../middleware/verifyToken.js"); //check if user is logged in
const verifyAdmin = require("../middleware/verifyAdmin.js"); //check if user is admin

postRouter.get("/", postController.getAllPostsWithAuthors);
postRouter.get("/:postId", postController.getPostWithAuthor);
postRouter.get("/:postId/comments", postController.getCommentsOfPost);

postRouter.post("/", verifyToken, verifyAdmin, postController.createNewPost);
postRouter.post("/:postId/comments", verifyToken, postController.createNewComment);

postRouter.put("/:postId", verifyToken, verifyAdmin, postController.updatePost);
postRouter.put("/:postId/status", verifyToken, verifyAdmin, postController.updatePostStatus) //updates whether post is published to public and when
postRouter.put("/:postId/comments/:commentId", verifyToken, postController.updateComment) //not checking for admin. users can modify own comments, implemented in controller


postRouter.delete("/:postId", verifyToken, verifyAdmin, postController.deletePost);
postRouter.delete("/:postId/comments/:commentId", verifyToken, postController.deleteComment)//not checking for admin. users can modify own comments, implemented in controller
//do I even need to bother specifying postId? db knows correct commentId.





module.exports = postRouter;
