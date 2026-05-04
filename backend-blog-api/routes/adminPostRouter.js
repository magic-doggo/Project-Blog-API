const { Router } = require("express");
const adminPostRouter = Router();
const postController = require("../controllers/postController.js");
const verifyToken = require("../middleware/verifyToken.js"); //check if user is logged in
const verifyAdmin = require("../middleware/verifyAdmin.js"); //check if user is admin

adminPostRouter.use(verifyToken, verifyAdmin);
//routes only admin users can access
adminPostRouter.get("/", postController.getAllPostsWithAuthors);
adminPostRouter.get("/:postId", postController.getPostWithAuthor);
adminPostRouter.get("/:postId/comments", postController.getCommentsOfPost);

adminPostRouter.post("/", postController.createNewPost);
adminPostRouter.post("/:postId/comments", postController.createNewComment);

adminPostRouter.put("/:postId", postController.updatePost);
adminPostRouter.put("/:postId/status", postController.updatePostStatus) //updates whether post is published to public and when
adminPostRouter.put("/:postId/comments/:commentId", postController.updateComment) 

adminPostRouter.delete("/:postId", postController.deletePost);
adminPostRouter.delete("/:postId/comments/:commentId", postController.deleteComment)




module.exports = adminPostRouter;
